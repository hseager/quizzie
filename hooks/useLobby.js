import useSWR from "swr";

export default function useLobby(id) {

    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data, error, mutate } = useSWR(`/lobbies/${id}`, fetcher)

    const setLobby = mutate

    return {
        lobby: data || [],
        setLobby,
        isLoading: !error && !data,
        isError: error
    }
}