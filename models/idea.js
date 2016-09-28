const mongoose = require('mongoose');

const ideaSchema = mongoose.Schema({
	title: String,
	description: String
});

const Idea = mongoose.model('Idea', ideaSchema);

exports.addIdea = function(req, res) {
	let newIdea = new Idea({
		title: req.body.title,
		description: req.body.description
	});

	newIdea.save(function (idea, err) {
		if(err) {
			console.error(err)
		}
		else {
			req.flash('ideaFlash','thank you for submiting your idea');
			res.redirect('/')
		}
	});
}