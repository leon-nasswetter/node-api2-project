// implement your posts router here
const express = require("express")
const Post = require("./posts-model")
const router = express.Router()

router.get("/", (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({ message: "The posts information could not be retrieved" })
            console.log(err)
        })
})

router.get("/:id", (req, res) => {
    const { id } = req.params
    Post.findById(id)
        .then(post => {
            if(!post){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }else{
                res.status(200).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved" })
            console.log(err)
        })
})

router.post("/", (req, res) => {
    const newPost = req.body
    if(!newPost.title || !newPost.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }else{
        Post.insert(newPost)
            .then(post => {
                Post.findById(post.id)
                    .then(addedPost => {
                        res.status(201).json(addedPost)
                    })
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" })
                console.log(err)
            })
    }
})

router.put("/:id", (req, res) => {
    const updatedPost = req.body
    const { id } = req.params
    if(!updatedPost.title || !updatedPost.contents){
       res.status(400).json({ message: "Please provide title and contents for the post" }) 
    }else{
        Post.update(id, updatedPost)
            .then(post => {
                if(!post){
                    res.status(404).json({ message: "The post with the specified ID does not exist" })
                }else{
                    Post.findById(id)
                        .then(updatedReturn => {
                            res.status(200).json(updatedReturn)
                        })
                }
            })
            .catch(err => {
                res.status(500).json({ message: "The post information could not be modified" })
            })
    }
})

router.delete("/:id", (req, res) => {
    const { id } = req.params
    Post.remove(id)
        .then(deleted => {
            if(deleted){
                res.status(200).json(deleted)
            }else{
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The comments information could not be retrieved" })
            console.log(err)
        })
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id;

    Post.findPostComments(id)
        .then(comments => {
            if (comments) {
                res.status(200).json(comments);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
})


module.exports = router