const Sauces = require("../models/Sauces");
const fs = require("fs");
const e = require("express");

///----------------------Create Sauce---------------------///

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject.userId;
  const sauce = new Sauces({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré avec succès !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
///----------------------Like Sauce---------------------///

exports.likeSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })

    .then((sauce) => {
      const like = req.body.like;
      const userLiked = sauce.usersLiked;
      const userDisliked = sauce.usersDisliked;

      if (like === 1) {
        userLiked.push(req.body.userId);

        Sauces.updateOne(
          { _id: req.params.id },
          {
            usersLiked: userLiked,
            likes: userLiked.length,
            _id: req.params.id,
          }
        )
          .then(() =>
            res.status(200).json({ message: "Objet modifié avec succès !" })
          )
          .catch((error) => res.status(401).json({ error }));
      } else if (like === -1) {
        userDisliked.push(req.body.userId);

        Sauces.updateOne(
          { _id: req.params.id },
          {
            usersDisliked: userDisliked,
            dislikes: userDisliked.length,
            _id: req.params.id,
          }
        )
          .then(() =>
            res.status(200).json({ message: "Objet modifié avec succès !" })
          )
          .catch((error) => res.status(401).json({ error }));
      }
      if (like === 0) {
        const findLike = userLiked.find((f) => f == req.body.userId);
        const findDislike = userDisliked.find((f) => f == req.body.userId);

        if (findLike) {
          const filterLike = userLiked.filter((e) => e !== findLike);
          Sauces.updateOne(
            { _id: req.params.id },
            {
              usersLiked: filterLike,
              likes: filterLike.length,
              _id: req.params.id,
            }
          )
            .then(() =>
              res.status(200).json({ message: "Objet modifié avec succès !" })
            )
            .catch((error) => res.status(401).json({ error }));
        } else if (findDislike) {
          const filterDislike = userDisliked.filter((e) => e !== findDislike);
          Sauces.updateOne(
            { _id: req.params.id },
            {
              usersDisliked: filterDislike,
              dislikes: filterDislike.length,
              _id: req.params.id,
            }
          )
            .then(() =>
              res.status(200).json({ message: "Objet modifié avec succès !" })
            )
            .catch((error) => res.status(401).json({ error }));
        }
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

///----------------------Modify Sauce---------------------///

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Non unauthorized request" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];

        fs.unlink(`images/${filename}`, () => {
          Sauces.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() =>
              res.status(200).json({ message: "Objet modifié avec succès !" })
            )
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

///----------------------Delete Sauce---------------------///

exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "unauthorized request" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];

        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé avec succès !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch();
};

///----------------------Get One Sauce---------------------///

exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

///----------------------Get All Sauce---------------------///

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};
