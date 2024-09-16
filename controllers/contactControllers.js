import { Contact } from "../models/contactModel.js";
import { contactValidator, favValidator } from "../validator/validator.js";

const getContacts = async (_req, res, next) => {
	try {
		return res.status(200).json(await Contact.find());
	} catch (e) {
		return next(e);
	}
}

const getContactById =  async (req, res, next) => {
	const _id = req.params.contactId;

	try {
		const result = await Contact.findOne({ _id });

		result ? res.status(200).json(result) : res.status(404).json({message: "Contact Not Found"});
	} catch (e) {
		return next(e);
	}
}

const addContact = async (req, res, next) => {
	const { error, value } = contactValidator(req.body);

	try {
		if (error) return res.json({message: error.message})

		const { name, email, phone } = value;
		return res.status(201).json(await Contact.create({ name, email, phone }));
	} catch (e) {
		res.status(409).json({message: "Contact Already Exists!"});
		return next(e);
	}
}

const deleteContact = async (req, res, next) => {
	const _id = req.params.contactId;

	try {
		const result = await Contact.findOneAndDelete({_id});

		if (result === null) return res.status(404).json({message: 'Contact Not Found'});

		return  res.status(200).json({message: 'Contact Deleted!'});
	} catch (e) {
		next(e);
	}
}

const updateContact = async (req, res, next) => {
	const _id = req.params.contactId;

	try {
		const { error, value } = contactValidator(req.body);

		if (error) return res.json({message: error.message});

		const result = await Contact.findOneAndUpdate({_id}, value);

		if (result === null) return res.status(404).json({message: "Contact Not Found!"});

		return res.status(200).json({message: "Contact Updated!"});
	} catch (e) {
		next(e);
	}
}

const updateStatus = async (req, res, next) => {
	const _id = req.params.contactId;
	const { favorite } = req.body;
	const { error, value } = favValidator({ favorite });

	if (error) return res.status(400).json({message: error.message});

	try {
		const result = await Contact.findOneAndUpdate({_id}, {favorite}, {new: value});
		
		if (!result) {
			return res.status(404).json({message: 'Not found'});
		}
		
		res.status(200).json(result);
		
	} catch (e) {
		next(e);
	}
}

export {
	getContacts,
	getContactById,
	addContact,
	deleteContact,
	updateContact,
	updateStatus
}