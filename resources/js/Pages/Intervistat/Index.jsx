import { useEffect, useState } from 'react'
import axios from 'axios'
import MainLayout from '../../Layouts/MainLayout'

export default function IntervistIndex() {
    const [intervistat, setIntervistat] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchIntervistat()
    }, [])

    const fetchIntervistat = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/intervistat')
            setIntervistat(response.data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
                    <p className="mt-1 text-gray-500">Manage scheduled interviews</p>
                </div>
                <a
                    href="/intervistat/create"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                >
                    + Schedule Interview
                </a>
            </div>

            {loading ? (
                <div className="py-12 text-center text-gray-500">Loading...</div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Candidate</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Position</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Date & Time</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Result</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {intervistat.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-400">
                                        No interviews scheduled
                                    </td>
                                </tr>
                            ) : (
                                intervistat.map((i) => (
                                    <tr key={i.interviste_id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {i.aplikimi?.kandidati?.emri} {i.aplikimi?.kandidati?.mbiemri}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {i.aplikimi?.vendi_punes?.titulli}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(i.data_intervistes).toLocaleDateString()} {i.ora}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{i.lokacioni}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                    i.rezultati === 'kaloi'
                                                        ? 'bg-green-100 text-green-700'
                                                        : i.rezultati === 'nuk_kaloi'
                                                          ? 'bg-red-100 text-red-700'
                                                          : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                            >
                                                {i.rezultati}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <a
                                                href={`/intervistat/${i.interviste_id}/edit`}
                                                className="text-xs text-indigo-600 hover:underline"
                                            >
                                                Edit
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    )
}
