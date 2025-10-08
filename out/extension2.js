const vscode = require('vscode');
const fetch = require('node-fetch');

class SupabaseDbProvider {
  constructor(context) {
    this._context = context;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;

    // Listen for changes to the active project
    this._context.globalState.onDidChange((e) => {
      if (e.key === 'activeSupabaseProjectRef') {
        this.refresh();
      }
    });
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren(element) {
    const projectRef = this._context.globalState.get(
      'activeSupabaseProjectRef'
    );
    const projectName = this._context.globalState.get(
      'activeSupabaseProjectName'
    );

    if (!projectRef) {
      return Promise.resolve([
        new vscode.TreeItem(
          'No active Supabase project selected.',
          vscode.TreeItemCollapsibleState.None
        ),
      ]);
    }

    if (!element) {
      // Root level: show the project name
      const projectItem = new vscode.TreeItem(
        projectName,
        vscode.TreeItemCollapsibleState.Expanded
      );
      projectItem.iconPath = new vscode.ThemeIcon('database');
      return Promise.resolve([projectItem]);
    }

    // Child level: show tables
    const supabaseToken = await this._context.secrets.get(
      'supabaseAccessToken'
    );
    if (!supabaseToken) {
      return Promise.resolve([
        new vscode.TreeItem(
          'Supabase token not found.',
          vscode.TreeItemCollapsibleState.None
        ),
      ]);
    }

    try {
      const response = await fetch(
        `https://api.supabase.com/v1/projects/${projectRef}/sql`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supabaseToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query:
              "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `API Error (${response.status}): ${await response.text()}`
        );
      }

      const tables = await response.json();
      return tables.map((table) => {
        const item = new vscode.TreeItem(
          table.table_name,
          vscode.TreeItemCollapsibleState.None
        );
        item.iconPath = new vscode.ThemeIcon('symbol-struct');
        return item;
      });
    } catch (error) {
      console.error('Failed to fetch Supabase tables:', error);
      vscode.window.showErrorMessage(
        `Failed to fetch Supabase tables: ${error.message}`
      );
      return Promise.resolve([
        new vscode.TreeItem(
          'Error fetching tables.',
          vscode.TreeItemCollapsibleState.None
        ),
      ]);
    }
  }
}

module.exports = {
  SupabaseDbProvider,
};
