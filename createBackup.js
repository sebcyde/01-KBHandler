const Moment = require('moment');
const path = require('path');
const fs = require('fs');

const createBackup = async (KBPath) => {
	const BackupDir = path.normalize('C:/Users/SebCy/Documents/Backups');
	const BackupDate = Moment().format('DDMMYYYY');

	console.log(`Creating backup ${BackupDate}.`);

	const FileData = await fs.promises.readFile(KBPath);

	await fs.promises.appendFile(
		`${BackupDir}/VSKeybindings/${BackupDate}.json`,
		FileData
	);

	console.log(`Backup created.`);
};

module.exports = { createBackup };
