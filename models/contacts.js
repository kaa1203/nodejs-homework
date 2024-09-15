import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

export const contactPath = path.join('models', 'contacts.json');

const listContacts = async () => {
	return JSON.parse(await fs.readFile(contactPath));
}

const getContactById = async (contactId) => {
	const contacts = await listContacts();
	const result = contacts.find((contact) => contact.id === contactId);

	return result || null;
}

const removeContact = async (contactId) => {
	const contacts = await listContacts();
	const index = contacts.findIndex(contact => contact.id === contactId);

	if (index === -1) return null;
	
	contacts.splice(index, 1);
	return await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
}

const addContact = async ({ name, email, phone }) => {
	const contacts = await listContacts();
	const newContact = {
		id: nanoid(),
		name,
		email,
		phone,
	}
	const updatedContact = [...contacts, newContact];
	await fs.writeFile(contactPath, JSON.stringify(updatedContact, null, 2));

	return updatedContact;
}

const updateContact = async (params) => {
	const { name, phone, email, id } = params;

	const contacts = await listContacts();
	const index = contacts.findIndex(contact => contact.id === id);

	if (index === -1) return null;

	contacts.splice(index, 1, { id, name, email, phone });

	return await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
	
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
