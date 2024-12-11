import { dbconnection } from "../db/connection.js"
import { postModel } from "../db/models/post.model.js"
import { postCollegeModel } from "../db/models/post_college.model.js"
import { createOptions } from "../utils/basic.utils.js"
// errors
import { postErrors } from "../error/post.error.js"
import { paginateQuery } from "../utils/db.utils.js"

export async function postCreate(data, transaction = null) {
    const options = createOptions(transaction)

    let newpostobj = {
        seller_ID: data.sellerID,
        book_ID: data.bookID,
        postDescription: data.postDescription,
    }
    if (data.isNegotiable === false) {
        newpostobj.isNegotiable = data.isNegotiable
    }
    if (data.soldStatus === true) {
        newpostobj.soldStatus = true
    }

    const newpost = await postModel.create(data, options)
    return newpost.dataValues
}

export async function deletePostByID(data, transaction = null) {

    const options = createOptions(transaction)
    const postID = data.postID
    const result = await postModel.destroy({
        where: {
            id: postID
        }
    }, options)
    return result

}

export async function getPostByID(data, transaction = null) {
    const options = createOptions(transaction)

    const postID = data.postID
    const result = await postModel.findByPk(postID, options)
    return result

}

export async function registerCollegePost(data, transaction = null) {

    /**
     * data : {
     *  obj : [
     *  {postID : "", collegeID : ""},
     *  {postID : "", collegeID : ""},
     *  {postID : "", collegeID : ""},
     *  {postID : "", collegeID : ""}
     * ]
     * }
     */
    const options = createOptions(transaction)

    const result = await postCollegeModel.bulkCreate(data.obj, options)

    return result.dataValues
}

export async function getPostByBookID({ whereClause, book_ID = null, limit = 5, page = 1 }, transaction = null) {
    /**
     * return the post(s) matching to the book_ID(s)
     * @param book_ID - primary keys of the book in a list,
     * @returns [posts]
     */
    if (book_ID === null) {
        throw postErrors.bookIDNULLError
    }

    let findString = ""
    for (let x in book_ID) {
        findString += book_ID[x]
        if (x != book_ID.length - 1) {
            findString += ", "
        }
    }

    if (findString === "") {
        return []
    }

    const options = createOptions(transaction)

    let queryString = "SELECT * FROM post_book_view"
    queryString += ` WHERE book_ID IN (${findString})`
    queryString = generateConditions(queryString, whereClause, false)
    queryString = paginateQuery(queryString, limit, page)
    console.log(queryString)
    const result = await dbconnection.query(queryString, options)
    result[0] = parseAuthors(result[0])
    return result[0]
}

export async function recommandedPost({ limit = 5, page = 1, whereClause }, transaction = null) {
    /**
     * @params limit and page in an object
     * @return return a list of post in a paginated from that are aranged according to the 
     *         decresing created time
    */
    let queryString = "SELECT * FROM post_book_view"
    queryString = generateConditions(queryString, whereClause, true)
    queryString = paginateQuery(queryString, limit, page)
    const result = await dbconnection.query(queryString)
    result[0] = parseAuthors(result[0])
    return result[0];
}

export async function getPostByUserId(userid, { limit = 2, page = 1 }) {
    let queryString = "SELECT id, bookName, subject, bookEdition, sellingPrice, img_urls, updatedAt FROM post_book_view "
    queryString += "WHERE seller_ID=" + userid
    queryString = paginateQuery(queryString, limit, page)
    const result = await dbconnection.query(queryString)
    return result[0]
}

export async function getPostBooksById(postid) {
    let queryString = `SELECT * FROM post_image_view  `
    queryString += `WHERE id=${postid}`
    const result = await dbconnection.query(queryString)
    return result[0]
}

export async function updatePost(postdata, postid, transaction = null) {
    const options = createOptions(transaction)
    const post = await postModel.update(postdata, {
        where: {
            id: postid
        }
    }, options)
    return post[0]
}

export async function deletePostCollege(postids, collegeids, transaction = null) {
    /**
     * delete the post and college associations
     * updates this function and make is for more
     */
    const options = createOptions(transaction)
    if (!(postids instanceof Array)) {
        throw new Error("excepted Array recived " + typeof (postids) + " postids")
    }
    if (!(collegeids instanceof Array)) {
        throw new Error("excepted Array recived " + typeof (postids) + " collegeids")
    }
    let queryString = "DELETE FROM Post_Colleges "
    queryString += " WHERE post_ID IN ("
    for (let i = 0; i < postids.length; i++) {
        queryString += postids[i];
        if (i !== postids.length) {
            queryString += ', '
        }
    }
    queryString += ") AND college_ID IN ("
    for (let i = 0; i < collegeids.length; i++) {
        queryString += collegeids[i];
        if (i !== collegeids.length) {
            queryString += ', '
        }
    }
    queryString += ")"
    const postcoldel = await dbconnection.query(queryString, options)
    return postcoldel
}

function parseAuthors(data) {
    for (let i = 0; i < data.length; i++) {
        data[i].bookAuthor = JSON.parse(data[i].bookAuthor)
    }
    return data
}

function generateConditions(queryString, whereClause, addWhere) {
    /**
     * code will generate the filters for user specific purpose
     * we can set if we have to add where by
     * @param addWhere boolean
     * @param queryString string
     * @param whereClause object - containg the where clause generated based on query 
     *      with help of middleware
     */
    let conditionString = " "
    if (Object.keys(whereClause).length !== 0) {
        if (addWhere) {
            conditionString += "WHERE "
        }
        else {
            conditionString += "AND "
        }
    }
    let iterated = 0
    for (let x in whereClause) {
        switch (x) {
            case "sold_status":
                conditionString += `soldStatus=${whereClause[x]}`
                break;

            case "min_price":
                conditionString += `sellingPrice <= ${whereClause[x]}`
                break;

            case "max_price":
                conditionString += `sellingPrice >= ${whereClause[x]}`
                break;

            case "edition":
                conditionString += `bookEdition = ${whereClause[x]}`
                break;

            case "college_name":
                conditionString += `collegeName="${whereClause[x]}"`
                break;
        }
        if (Object.keys(whereClause).length - 1 !== iterated) {
            conditionString += " AND "
        }
        iterated++
    }
    return queryString + conditionString
}