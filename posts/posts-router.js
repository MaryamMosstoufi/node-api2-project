const router = require("express").Router();
const Posts = require("./../data/db");


const samplePost = {
  title: "The post title", // String, required
  contents: "The post contents", // String, required
  created_at: "Mon Aug 14 2017 12:50:16 GMT-0700 (PDT)", // Date, defaults to current date
  updated_at: "Mon Aug 14 2017 12:50:16 GMT-0700 (PDT)" // Date, defaults to current date
}

const sampleComment = {
  text: "The text of the comment", // String, required
  post_id: "The id of the associated post", // Integer, required, must match the id of a post entry in the database
  created_at: "Mon Aug 14 2017 12:50:16 GMT-0700 (PDT)", // Date, defaults to current date
  updated_at: "Mon Aug 14 2017 12:50:16 GMT-0700 (PDT)" // Date, defaults to current date
}

// POST | /api/posts | Creates a post using the information sent inside the `request body`.                                    
router.post("/", (req, res) => {
  if (req.body.title && req.body.contents) {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: "There was an error while saving the post to the database" });
      });
  }else if (!req.body.title || !req.body.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  }    
});
// POST | /api/posts/:id/comments | Creates a comment for the post with the specified id using information sent inside of the `request body`.   
router.post("/:id/comments", (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ errorMessage: "Please provide text for the comment." });
  } else if (req.body.text) {
    Posts.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        Posts.insertComment(req.body)
          .then(comment => {
            res.status(201).json(comment);
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({error: "There was an error while saving the comment to the database" });
          });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
  } 
});
// GET | /api/posts | Returns an array of all the post objects contained in the database.
router.get("/", (req, res) => {
  Posts.find()
    .then(allPosts => {
      res.status(200).json(allPosts)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: "The posts information could not be retrieved." })
    })
});
// GET | /api/posts/:id | Returns the post object with the specified id.     
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        res.status(201).json(post);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
});
// GET | /api/posts/:id/comments | Returns an array of all the comment objects associated with the post with the specified id.
router.get("/:id/comments", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        Posts.findPostComments(req.params.id)
          .then(comments => {
            res.status(201).json(comments);
          })
          .catch(error => {
            console.log(error)
            res.status(500).json({ error: "The comments information could not be retrieved." })
          })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The posts information could not be retrieved." })
    })
});
// DELETE | /api/posts/:id | Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement. 
router.delete("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        Posts.remove(req.params.id)
          .then(post => {
            res.status(201).end();
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The post could not be removed" })
          })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
});
// PUT | /api/posts/:id | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.
router.put("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        if (!req.body.title || !req.body.contents) {
           res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        } else {
          Posts.update(req.params.id, req.body)
            .then(post => {
              res.status(201).json(post);
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({ error: "The post information could not be modified." })
            })
        }
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
});
module.exports = router;