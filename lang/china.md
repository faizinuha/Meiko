# ⚡ Meiko

<p align="center">
  <img src="../assets/icons1.jpeg" alt="Meiko Logo" width="100" style="border-radius: 30px;" /><hr>
</p>
 **Meiko** 是一个旨在简化编码体验的Visual Studio Code扩展。通过支持四种编程语言，此扩展通过各种提供的模板加快和简化了代码编写过程。

![Meiko](https://img.shields.io/badge/Meiko-Meiko-blue)
![Meiko](https://img.shields.io/badge/Meiko-Meiko-blue)

<p align="center">
🐱‍👤 -> 
  <strong><a href="https://github.com/faizinuha/Meiko/blob/main/lang/JP.md">日语</a></strong>
  <strong><a href="https://github.com/faizinuha/Meiko/blob/main/lang/EN.md">英语</a></strong>
  <strong><a href="https://github.com/faizinuha/Meiko/blob/main/lang/ID.md">印尼语</a></strong>
  <strong><a href="https://github.com/faizinuha/Meiko/blob/main/lang/korea.md">韩语</a></strong>
</p>

## 💖 捐赠

如果您喜欢这个扩展并想支持开发者，请考虑捐赠！

<a href="https://saweria.co/C02V">
    <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="捐赠图标" width="150" />
</a>
|
<a href="https://ko-fi.com/mahiro885">
    <img src="../assets/image.png" alt="捐赠图标" width="40" />
</a>

---

## 🚀 主要功能演示

以下是Meiko的主要功能列表：

- 🌐 **多语言支持**: 支持四种编程语言。
- 📋 **代码片段模板**: 提供各种模板以加快代码编写速度。
- ⚡ **Emmet替代**: 帮助未在Visual Studio Code中启用Emmet的用户。

## 📥 使用方法

1. **安装扩展**:
   - 🛒 打开Visual Studio Code市场。
   - 🔍 搜索并下载 **Meiko**。
2. **享受编码体验**:
   - ⚡ 使用各种提供的快捷方式，获得更简单轻松的编码体验。

---

## 🤝 贡献

如果您发现bug或有改进建议，请：

- 🛠️ **创建pull request**。
- 🐞 **在[我们的GitHub仓库](https://github.com/faizinuha/Meiko)上报告问题**。

---

## 📂 功能

### 文件扩展名转换器
新功能，可将各种框架的短文件名转换为完整名称：

#### 框架支持：
- 🌐 **Laravel**: `.b.p` → `.blade.php` 或 `.b.php` → `.blade.php`
- 🔄 **Ruby on Rails**: `.e.rb` → `.html.erb` 或 `.erb.h` → `.html.erb`
- ⚛️ **React/Next.js**: 
  - `.j.tsx` → `.jsx.tsx`
  - `.tsx.c` → `.component.tsx` 
  - `.p.tsx` → `.page.tsx`
- 📱 **Vue.js**:
  - `.v.js` → `.vue.js`
  - `.v.c` → `.vue.component.js`
- 🅰️ **Angular**:
  - `.c.ts` → `.component.ts`
  - `.s.ts` → `.service.ts`
  - `.m.ts` → `.module.ts`
- 🎯 **Svelte**: `.s.svelte` → `.svelte`
- 🐘 **PHP**: `.t.php` → `.template.php`
- 🐍 **Django/Python**:
  - `.d.py` → `.django.py`
  - `.v.py` → `.view.py`
  - `.t.py` → `.template.py`

### 新的Meiko CLI终端

#### **Laravel Solid**
Laravel Solid是一个帮助开发者准备具有可靠结构的Laravel项目的功能，具有整洁且易于使用的初始配置。

#### **Coders Solid**
此功能使用户能够快速设置准备进一步开发的基本Laravel框架。主要特点：

- 🛠️ **基本安装**: 
  - 组织良好的目录结构。
  - 适用于小型到中型项目的默认配置文件。
- ⏱️ **时间效率**: 无需手动重新组织文件即可启动项目。

#### **Coders-delete**
如果创建的项目未被使用，此功能用于删除Laravel文件夹或文件。

- 🚮 **快速删除**: 节省用户时间。
- 🔒 **数据安全**: 仅删除选定的项目文件夹。

---

### 💻 **Coders-crud CLI**

用于创建Laravel CRUD的简单CLI：

1. ⌨️ 使用`Ctrl + J`**打开终端**。
2. 输入`coders-crud <NameProject>`。
3. 🎉 **根据需要编辑**，无需从头开始创建。
4. 🚀 无限制使用此CLI。

---

### 代码片段

#### 🏗️ **HTML**

- 🖋️ **BSS**: 带有最新Bootstrap链接的Doctype。
- 🖋️ **DCS**: 不带Bootstrap链接的Doctype。
- 🖋️ **tbl**: 基本表格。
- 🖋️ **Footer**: 基本页脚。
- 🖋️ **list**: 基本列表。
- 🖋️ **Image**: 简单表单。
- 🖋️ **HtmlForm**: HTML详情和摘要。
- ⏳ **即将推出**: 更多详情。

#### 🛠️ **Laravel代码片段**

- 📜 **Blade Layout**: 基本Blade模板。
- 📜 **bladenav**: 创建导航栏。
- 📜 **bladeFooter**: 基本页脚。
- 📜 **bladeContent**: 基本内容显示。
- 🔒 **MiddlewareRoute**: 定义带中间件的路由。
- 🌐 **route**: 基本路由。
- 🔄 **forelse**: Blade中的`forelse`。
- 🔄 **foreach**: Blade中的`foreach`。
- 📊 **Query**: 基本Laravel查询。
- 🛠️ **Crud Mod**: Laravel CRUD模板。
- ✅ **Validate 2x5**: Laravel查询验证模板。

#### ⚡ **Laravel查询功能**

- 🔍 **Query Builder**: 如`when`、`orWhere`和`orWhereRaw`等语句。
- 📚 **Eloquent ORM**: 数据库管理的面向对象方法。

---

#### ☕ **Java**

- 🌀 **Javasegitinga**: 创建三角形模式。
- ⭐ **Javastar**: 创建星形模式。
- 👋 **Javahello**: Hello World程序。
- ➕ **Javapenjumlahan**: 两个数字的加法。
- ⏳ **即将推出**: 计算器构建2.5.4。

---

#### 🛠️ **Vue.js**

- 🏗️ **Vue Button Flex Layout**: Vue.js中的按钮和flex布局样式。
- 🏗️ **Count Vue**: 简单的Vue 3计数器代码片段。
- 🏗️ **Vue List Rendering**: 使用Vue 3中的v-for渲染列表的代码片段。
- 🏗️ **Vue Two-Way Binding**: 使用Vue 3中的v-model进行双向绑定的代码片段。
- 🏗️ **Vue Modal Component**: 创建Vue 3简单模态框的代码片段。
- 🏗️ **Vue Form Component**: 创建Vue 3简单表单的代码片段。

<hr>

# 📝 许可证：
版权所有 (c) 2024 Zaky Development

特此免费授予任何获得本软件及相关文档文件（"软件"）副本的人不受限制地处理本软件的权利，
包括但不限于使用、复制、修改、合并、出版、发行、再许可和/或销售本软件副本的权利，
并允许向其提供本软件的人在遵循以下条件的情况下这样做：