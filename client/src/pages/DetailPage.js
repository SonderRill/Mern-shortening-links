import React, { useState, useContext, useEffect } from "react"
import { useParams } from 'react-router-dom'
import { useHttp } from "../hooks/http.hook"
import { AuthContext } from "../context/AuthContext"
import { Loader } from "../components/Loader"
import { LinkCard } from "../components/LinkCard"

export const DetailPage = () => {
    const { token } = useContext(AuthContext)
    const { request, loading } = useHttp()
    const [link, setLink] = useState(null)
    const linkId = useParams().id

    useEffect(() => {
        async function getLink() {
            try {
                const fetched = await request(`/link/${linkId}`, 'GET', null, {
                    authorization: token
                })
                setLink(fetched)

            } catch (e) {
                console.log(e)
            }
        }
        getLink()
    }, [linkId, request, token])

    if (loading) {
        return <Loader />
    }
    return (
        <>
            {!loading && link && <LinkCard link={link} />}
        </>
    )
}