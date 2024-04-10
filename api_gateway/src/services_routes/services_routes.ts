type routes = {
    url: string
    method: 'get' | 'post' | 'delete' | 'patch`'

}

export const services_routes: Array<routes> = [
    {
        url: "/get_friends",
        method: "get"
    },
    {
        url: "/add_friends",
        method: "get"
    }
]