import express from "express"
import { HandleErrors } from "../middlewares/handleError.js"
// controllers
import { postController } from "../controllers/post.controller.js"
// middleware
import { isUserLoggedIn } from "../middlewares/user.middleware.js"
import { generateWhereClause } from "../middlewares/query.middleware.js"

export const postRouter = express.Router()
const postControllers = postController()

postRouter.route("/").get(generateWhereClause, HandleErrors(postControllers.recommandedPost)) // will return random posts
postRouter.route("/register").post(isUserLoggedIn, HandleErrors(postControllers.registerPost))
postRouter.route("/postbookid").post(generateWhereClause, HandleErrors(postControllers.getByBookId))
postRouter.route("/postbyuserid").get(isUserLoggedIn, HandleErrors(postControllers.getPostByUserId))
// get the post by the post id
postRouter.route("/getbyid/:id").get(isUserLoggedIn, HandleErrors(postControllers.getPostById))
postRouter.route("/update").put(isUserLoggedIn, HandleErrors(postControllers.updatePost))