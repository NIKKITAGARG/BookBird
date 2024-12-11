import { createOptions } from "../utils/basic.utils.js";
import { PostImageModel } from "../db/models/media.model.js"
import { dbconnection } from "../db/connection.js";

export async function registerPostImages(data, postID, transaction = null) {
    /**
     * @param data : [{
     *      url : "",
     *      imageFor : ""
     * }]
     */
    const options = createOptions(transaction)
    let images = []
    for (let x in data) {
        let img = {
            postId: postID,
            imageUrl: data[x].url,
            mimeType: data.mineType,
            imageFor: data[x].imageFor
        }
        images.push(img)
    }
    const result = await PostImageModel.bulkCreate(images, options)
    return result
}

export async function deletePostImages(postId, imageFor, transaction = null) {
    const options = createOptions(transaction)
    let queryString = "DELETE FROM Post_Images "
    queryString += "WHERE postId = " + postId + " AND imageFor IN ("
    for (let i = 0; i < imageFor.length; i++) {
        queryString += `"${imageFor[i]}"`
        if (i != imageFor.length - 1) {
            queryString += ", "
        }
    }
    queryString += ")"
    console.log(queryString)
    const result = await dbconnection.query(queryString, options)
    return result
}