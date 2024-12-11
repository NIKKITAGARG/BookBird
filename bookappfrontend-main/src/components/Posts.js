import { useRef } from "react";
import clsx from "clsx";
import useLazyLoad from "./useLazyLoad";
import Cards, { Card } from './Cards';
import { LoadingPosts } from './LoadingPosts';

export const Posts = () => {
    const triggerRef = useRef(null);
    const onGrabData = (currentPage) => {
        // This would be where you'll call your API
        return new Promise((resolve, reject) => {
            setTimeout(() => {

                const body = {
                    "page": 1,
                    "search": "concepts",
                    "book_ID": 1
                }

                const data = fetch("http://192.168.31.244:7890/api/v1/post?limit=2&page=2", {
                    method: "GET"
                }).then((data) => data.json()).then(data => {
                    resolve(data.result);
                }).catch((err) => {
                    reject(err)
                })
            }, 0);
        });
    };
    console.log("jelow")
    const { data, loading } = useLazyLoad({ triggerRef, onGrabData });
    return (
        <>
            <div className="m-auto w-full">
                {data.map((element, index) => {
                    // console.log(element)
                    return <Cards data={element} key={index} />
                })}
            </div>
            <div ref={triggerRef} className={clsx("trigger", { visible: loading })}>
                <LoadingPosts />
            </div>
        </>
    );
}