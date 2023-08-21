const { google } = require('googleapis');
const pkey = require('./vskbackups-48d1b5c4d4d2.json');

const getFolderIdByPath = async (folderPath) => {
	const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

	// Use service account to authenticate
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

	// Get folder ID
	const findFolderId = async (authClient) => {
		const drive = google.drive({ version: 'v3', auth: authClient });

		try {
			const folderNames = folderPath.split('/'); // Split the path into folder names

			let parentFolderId = 'root'; // Start with the root folder as the parent

			for (const folderName of folderNames) {
				const response = await drive.files.list({
					q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentFolderId}' in parents`,
					fields: 'files(id)',
				});

				if (response.data.files.length > 0) {
					parentFolderId = response.data.files[0].id; // Use the found folder as the new parent
				} else {
					throw new Error(
						`Folder '${folderName}' not found in '${parentFolderId}'`
					);
				}
			}

			return parentFolderId;
		} catch (error) {
			throw error;
		}
	};

	return authorize().then(findFolderId);
};

module.exports = { getFolderIdByPath };
