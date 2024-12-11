create or replace view post_image_view as
 select p.*, group_concat(imageUrl separator ', ') AS img_urls, i.createdAt as img_create_date, c.collegeName, c.id as college_ID from Posts as p
 inner join Post_Images as i on i.postId = p.id 
 inner join Post_Colleges as pc on p.id = pc.post_ID
 inner join Colleges as c on pc.college_ID = c.id
 group by p.id order by p.createdAt DESC;

CREATE OR REPLACE VIEW post_book_view AS
	SELECT p.*, bookName, bookEdition, bookAuthor, publication, subject, ISBN, group_concat(imageUrl SEPARATOR ', ') AS img_urls, userNames, contacts, email, collegeName, city FROM Posts AS p
    INNER JOIN Books ON p.book_ID=Books.id
    INNER JOIN Post_Images AS pi ON pi.postId=p.id
    INNER JOIN Users ON Users.id=p.seller_ID
    INNER JOIN Post_Colleges AS pc ON pc.post_ID=p.id
    INNER JOIN Colleges ON Colleges.id = pc.college_ID=Colleges.id
    GROUP BY postId ORDER BY p.createdAt DESC;