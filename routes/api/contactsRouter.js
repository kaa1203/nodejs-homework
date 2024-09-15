import express from "express";
import { listContacts, addContact, getContactById, removeContact, updateContact } from "../../models/contacts.js";

import validator from "../../validator.js";

const router = express.Router();

router.get('/', async (_req, res, next) => {
	try {
		return res.status(200).json(await listContacts());
	} catch (e) {
		return next(e);
	}
})

router.get('/:contactId', async (req, res, next) => {
	try {
		const result = await getContactById(req.params.contactId);
		result ? res.status(200).json(result) : res.status(404).json({message: "Contact Not Found"});
	} catch (e) {
		return next(e);
	}
})

router.post('/', async (req, res, next) => {
  try {
		const { error, value } = validator(req.body);
		if (error) return res.json({message: error.message})

		const { name, email, phone } = value;
		return res.status(201).json(await addContact({ name, email, phone }));
	} catch (error) {
		return next(e);
	}
})

router.delete('/:contactId', async (req, res, next) => {
  try {
	const result = await removeContact(req.params.contactId);
	if (result === null) return res.status(404).json({message: 'Contact Not Found'});

	return  res.status(200).json({message: 'Contact Deleted!'});
  } catch (e) {
	next(e);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
	const id = req.params.contactId;
	const { error, value } = validator(req.body);

	if (error) return res.json({message: error.message});
	const params = { ...value, id };
	const result = await updateContact(params);

	if (result === null) return res.status(404).json({message: "Contact Not Found!"});

	return res.status(200).json({message: "Contact Updated!"});
  } catch (e) {
	next(e);
  }
})

export { router };
