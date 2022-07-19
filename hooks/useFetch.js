import { useEffect, useState } from 'react'

const useFetch = (url) => {
    const [data, setData] = useState([])
    const [error, setError] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async() => {
            setLoading(true)
            const token = localStorage.getItem('token')
            let headersList = {
                "Accept": "*/*",
                "Authorization": `Bearer ${token}`
            }

            fetch(url, { 
                method: "GET",
                headers: headersList
            }).then(function(response) {
                return response.text();
            }).then(function(data) {
                setLoading(false)
                const response = JSON.parse(data)
                if(response.error) {
                    setError(response.error)
                } else {
                    setData(response)
                }
            })
        }

        fetchData()
    }, [url])

    return { loading, error, data }
}

export default useFetch;