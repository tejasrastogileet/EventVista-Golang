import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { baseURL } from "../utils/api"

function EditEvent() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [datetimeLocal, setDatetimeLocal] = useState("")

    const navigate = useNavigate()


    const { id } = useParams()

    const fetchEvent = async (id) => {
        try {
            const response = await fetch(`${baseURL}/events/${id}`)
            if (!response.ok) {
                throw new Error("Failed to fetch event details")
            }
            const data = await response.json()
            setName(data?.data.name)
            setDescription(data?.data.description)
            setLocation(data?.data.location)

            try {
                const iso = data?.data.datetime || data?.data.dateTime || ''
                if (iso) {
                    const d = new Date(iso)
                    if (!isNaN(d)) {
                        const yyyy = d.getFullYear()
                        const mm = String(d.getMonth() + 1).padStart(2, '0')
                        const dd = String(d.getDate()).padStart(2, '0')
                        const hh = String(d.getHours()).padStart(2, '0')
                        const min = String(d.getMinutes()).padStart(2, '0')
                        setDatetimeLocal(`${yyyy}-${mm}-${dd}T${hh}:${min}`)
                    }
                }
            } catch (e) {
               
            }
        } catch (error) {
            toast.error("Could not fetch event details")
        }
    }

    useEffect(() => {
        fetchEvent(id)
    }, [id])


    const updateEvent = async (updateEvent) => {
        const token = localStorage.getItem("eventToken")

        try {
            const res = await fetch(`${baseURL}/events/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateEvent)
            })

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to update event");
                return;
            }

            toast.success("Event updated successfully!")

        } catch (error) {
            toast.error("An error occurred while updating the event.", error)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !description || !location) {
            return;
        }
        let isoDatetime = new Date().toISOString()
        if (datetimeLocal) {
            const parsed = new Date(datetimeLocal)
            if (!isNaN(parsed)) {
                isoDatetime = parsed.toISOString()
            }
        }

        const newEvent = {
            name: name,
            description: description,
            location: location,
            datetime: isoDatetime,
        }
        await updateEvent(newEvent)
        navigate("/dashboard");
    }

    return (
        <div className="container">
            <h1>EventVista — Edit Event</h1>
            <button onClick={() => navigate(-1)} className="previous__page">Go back</button>
            <form onSubmit={handleSubmit} className="create__event">
                <div className="">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="">
                    <label htmlFor="description">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={10} id="description"></textarea>
                </div>
                <div className="">
                    <label htmlFor="location">Location</label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="">
                    <label htmlFor="datetime">Date & time</label>
                    <input type="datetime-local" id="datetime" value={datetimeLocal} onChange={(e) => setDatetimeLocal(e.target.value)} />
                    <small className="muted">Set the event date/time here</small>
                </div>
                <input type='submit' value="Update Event" />

            </form>
        </div>
    )
}

export default EditEvent
