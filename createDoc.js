const { getFolderIdByPath } = require('./getFolderID');
const { google } = require('googleapis');
const process = require('process');
const Moment = require('moment');
const path = require('path');
const fs = require('fs');

const DocDate = Moment().format('DDMMYYYY');

const createDoc = async (FilePath) => {
	const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
	const pkey = require('./vskbackups-48d1b5c4d4d2.json');
	const BackupsID = '1wsZb-Eu6yurbVuA7YRPRq5L5aDla7KUt';
	const VSCKID = '1iIuWbWsrH5TEtddw4FEwKZjKuT9PKASj';

	// Use service acct to auth
	const authorize = async () => {
		const jwtClient = new google.auth.JWT(
			pkey.client_email,
			null,
			pkey.private_key,
			SCOPES
		);
		await jwtClient.authorize();
		return jwtClient;
	};

	// Create and upload
	const uploadFile = async (authClient) => {
		const drive = google.drive({ version: 'v3', auth: authClient });
		const FileData = fs.createReadStream(FilePath);

		const file = await drive.files.create({
			fields: 'id',
			media: {
				mimeType: 'application/json',
				body: FileData,
			},
			requestBody: {
				name: `${DocDate}.json`,
				permissions: '',
				// parents: [BackupsID, VSCKID],
			},
		});

		console.log('Drive file created with ID:', file.data.id);

		// Set permissions for the uploaded file
		const permissions = await drive.permissions.create({
			fileId: file.data.id,
			requestBody: {
				role: 'reader', // 'reader', 'writer', 'commenter', 'owner'
				type: 'anyone', // 'user', 'group', 'domain', 'anyone'
				allowFileDiscovery: true,
			},
		});

		console.log('Drive file permissions set:', permissions.data);
	};

	authorize().then(uploadFile).catch(console.error);
};

module.exports = { createDoc };
