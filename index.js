const { createBackup } = require('./createBackup');
const { createDoc } = require('./createDoc');
const debounce = require('lodash.debounce');
const notifier = require('node-notifier');
const Chokidar = require('chokidar');
const path = require('path');

const Main = async () => {
	const KBPath = path.normalize(
		'C:/Users/SebCy/AppData/Roaming/Code/User/keybindings.json'
	);

	const watcher = Chokidar.watch(KBPath);

	const debouncedAction = debounce(async (Filepath) => {
		await createBackup(Filepath);
		await createDoc(Filepath);

		notifier.notify({
			icon: './Icons/JessicaIcon.png',
			appID: 'KB Handler',
			id: 'KB Handler',
			message: `Keybindings have been updated.`,
		});
	}, 5000);

	watcher.on('change', (Path) => {
		try {
			debouncedAction(Path);
		} catch (error) {
			notifier.notify({
				title: 'Keybindings',
				icon: './Icons/JessicaIcon.png',
				appID: 'KB Handler',
				message: `Error updating keybindings.`,
			});
		}
	});

	watcher.on('error', (error) => {
		console.error(`Error updating keybindings: ${error}`);
	});
};

Main();
