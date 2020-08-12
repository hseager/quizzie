import useSWR from "swr";
import fetcher from '../libs/fetcher'

export default function useLobby(id) {
    const { data, error, mutate } = useSWR(`/api/lobbies/${id}`, fetcher)

    const setLobby = mutate

    return {
        lobby: data,
        setLobby,
        isLoading: !error && !data,
        isError: error
    }
}