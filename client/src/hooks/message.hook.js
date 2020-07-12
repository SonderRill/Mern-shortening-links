import { useCallback } from 'react'

export const useMessage = () => {
    return useCallback(text => {
        if (window.M && text) {
            if (text.errors) {
                text.errors.forEach(i => {
                    window.M.toast({ html: i.msg })
                })

            }
            else {
                window.M.toast({ html: text.msg })
            }

        }
    }, [])
}