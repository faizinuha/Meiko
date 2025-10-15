const vscode = require('vscode');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

class SupabaseDbProvider {
  constructor(context) {
    this._context = context;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    // Initialize internal state from global state on activation
    this.projectRef = this._context.globalState.get('activeSupabaseProjectRef');
  }

  /**
   * Refreshes the tree view.
   * @param {string} [projectRef] - The new project reference. If provided, the internal state is updated.
   * If not provided, it re-reads from global state (e.g., on logout).
   */
  refresh(projectRef) {
    if (projectRef !== undefined) {
      this.projectRef = projectRef;
    } else {
      // On logout or initial load, get from global state
      this.projectRef = this._context.globalState.get('activeSupabaseProjectRef');
    }
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren(element) {
    // Use the internal projectRef property for reliability
    const projectRef = this.projectRef;

    if (!element) { // Root level
      if (!projectRef) {
        return [new vscode.TreeItem('No active Supabase project. Please login.', vscode.TreeItemCollapsibleState.None)];
      }
      const projectName = this._context.globalState.get('activeSupabaseProjectName') || 'Supabase Project';
      const projectItem = new vscode.TreeItem(projectName, vscode.TreeItemCollapsibleState.Collapsed);
      projectItem.contextValue = 'supabaseProject';
      projectItem.iconPath = new vscode.ThemeIcon('database');
      return [projectItem];
    }

    if (element.contextValue === 'supabaseProject') {
      return this.getTables(projectRef);
    }

    if (element.contextValue === 'supabaseTable') {
      return this.getColumns(projectRef, element.label);
    }

    return [];
  }

  async getTables(projectRef) {
    const supabaseToken = await this._context.secrets.get('supabaseAccessToken');
    if (!supabaseToken) {
      return [new vscode.TreeItem('Supabase token not found.', vscode.TreeItemCollapsibleState.None)];
    }

    try {
      const response = await this.executeSql(projectRef, supabaseToken, "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;");
      if (!Array.isArray(response)) {
        throw new Error('Unexpected response format from Supabase.');
      }
      return response.map(table => {
        const item = new vscode.TreeItem(table.table_name, vscode.TreeItemCollapsibleState.Collapsed);
        item.contextValue = 'supabaseTable';
        item.iconPath = new vscode.ThemeIcon('symbol-struct');
        return item;
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to fetch Supabase tables: ${error.message}`);
      return [new vscode.TreeItem('Error fetching tables.', vscode.TreeItemCollapsibleState.None)];
    }
  }

  async getColumns(projectRef, tableName) {
    const supabaseToken = await this._context.secrets.get('supabaseAccessToken');
    if (!supabaseToken) {
      return [new vscode.TreeItem('Supabase token not found.')];
    }

    try {
      const sql = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${tableName.replace(/'/g, "''")}' AND table_schema = 'public' ORDER BY ordinal_position;`;
      const columns = await this.executeSql(projectRef, supabaseToken, sql);
      return columns.map(column => {
        const item = new vscode.TreeItem(column.column_name, vscode.TreeItemCollapsibleState.None);
        item.description = column.data_type;
        item.iconPath = new vscode.ThemeIcon('symbol-field');
        return item;
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to fetch columns for table ${tableName}: ${error.message}`);
      return [new vscode.TreeItem('Error fetching columns.')];
    }
  }

  async executeSql(projectRef, token, sql) {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/sql`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: sql }),
      }
    );
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error (${response.status}): ${response.statusText}. ${errorBody}`);
    }
    return await response.json();
  }
}

module.exports = {
  SupabaseDbProvider,
};

