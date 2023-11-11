import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf } from 'obsidian';
import Container from "./Components/Container.svelte";
import jsyaml from 'js-yaml';

// Remember to rename these classes and interfaces!

const MY_CUSTOM_VIEW_TYPE = 'my-custom-view';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

class MyCustomView extends ItemView {
	component: Container;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return MY_CUSTOM_VIEW_TYPE;
    }

    getDisplayText() {
        return 'Timeline';
    }

    async onOpen() {
        // const div = document.createElement('div');
        // div.textContent = 'Hello!!!';
        // this.containerEl.children[1].appendChild(div);

		let data_to_pass = [];

		const markdownFiles = this.app.vault.getMarkdownFiles(); 
		
		// Iterate over each file
		for (const file of markdownFiles) {
			try {
				const content = await this.app.vault.read(file);
				// Here, parse the content to extract properties
				// For example, extract YAML frontmatter or other specific data




				const frontmatterRegex = /^---\s*[\s\S]*?---/;  // Regular expression to match YAML frontmatter

				if (frontmatterRegex.test(content)) {
					const frontmatter = content.match(frontmatterRegex)[0];
					// Remove the --- lines
					const yamlContent = frontmatter.replace(/---/g, '').trim();
					
					// Parse the YAML content to a dictionary
					// Assuming you have a YAML parsing library like js-yaml
					try {
						const data = jsyaml.load(yamlContent);
						// console.log("dataaaaa:", data);
						// return data;


						if (data?.type === "paper" && data?.date && data?.title_short)
						{
							data_to_pass.push({
								"date": new Date(data.date),
								"title": data.title_short,
							});
						}
					} catch (error) {
						console.error("Error parsing YAML:", error);
						// return null;
					}
				} else {
					// return null; // No YAML frontmatter found
				}





			} catch (error) {
				console.error("Error reading file:", error);
			}
		}

		this.component = new Container({
			target: this.contentEl,
			props: {
			  	"data": data_to_pass,
			}
		});
    }

    async onClose() {
		this.component.$destroy();
    }
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// Register the custom view
		this.registerView(
			MY_CUSTOM_VIEW_TYPE,
			(leaf) => new MyCustomView(leaf)
		);

		// Add a command to open your custom view
		this.addCommand({
			id: 'open-my-custom-view',
			name: 'Open My Custom View',
			callback: () => this.activateView(),
		});

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
        // Open the view in a new leaf
        this.app.workspace.detachLeavesOfType(MY_CUSTOM_VIEW_TYPE);
        await this.app.workspace.getRightLeaf(true).setViewState({
            type: MY_CUSTOM_VIEW_TYPE,
        });
    }
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
