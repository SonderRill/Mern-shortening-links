import { useState, useCallback, useEffect } from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setUserId(id)

        localStorage.setItem(storageName, JSON.stringify({
            userId: id,
            token: jwtToken
        }))

    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)
    }, [])


    // useEffect(() => {
    //     const data = JSON.parse(localStorage.getItem(storageName))

    //     if (data && data.token) {
    //         login(data.token, data.userId)
    //     }
    //     setReady(true)
    // }, [login])

    useEffect(() => {

        async function getCheck() {
            try {

                const data = JSON.parse(localStorage.getItem(storageName))
                if (data && data.token) {
                    const check = await fetch('/auth/getAuth', {
                        method: 'GET',
                        headers: {
                            authorization: data.token
                        }
                    })

                    if (!check.ok) {
                        setReady(true)
                        localStorage.removeItem('userData')
                        throw await check.json()
                    }

                    setToken(data.token)
                    setUserId(data.userId)
                }
                setReady(true)

            } catch (e) {
                console.log(e)
            }

        }
        getCheck()


    }, [])

    return { login, logout, token, userId, ready }
}