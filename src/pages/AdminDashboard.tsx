import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Compass, Hotel, Plus, Edit, Trash2, Save, X,
  ArrowLeft, Star, Search, SlidersHorizontal, ChevronRight,
  HelpCircle, Upload, Phone, Users
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { TableSkeleton } from '../components/common/Skeleton'

type Destination = {
  id: number
  name: string
  image: string
  description: string
  price: string
  rating: number
  location: string
  altitude?: string
  ideal_stay?: string
  peak_period?: string
  language?: string
  descriptionText?: string
  itinerary?: { day: string; title: string; detail: string }[]
  amenities?: { icon: string; label: string; desc: string }[]
  reviews?: { name: string; date: string; rating: number; text: string }[]
}

type Tour = {
  id: string
  title: string
  duration: string
  nights: number
  price: string
  priceVal: number
  image: string
  desc: string
  category: string
  difficulty: string
  inclusions: string[]
  exclusions: string[]
  itinerary: { day: number; title: string; desc: string }[]
  descText?: string
  visaAdvice?: string
  altitudeAdvice?: string
  currencyAdvice?: string
}

type LuxuryHotel = {
  id: number
  name: string
  location: string
  image: string
  rating: number
  price: string
  description: string
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'destinations' | 'tours' | 'hotels' | 'about' | 'contact' | 'testimonials' | 'tourists'>('destinations')

  // Data States
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [tours, setTours] = useState<Tour[]>([])
  const [hotels, setHotels] = useState<LuxuryHotel[]>([])
  const [tourists, setTourists] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Search and sorting states
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'default'>('default')

  // Form States (Modal)
  const [showModal, setShowModal] = useState(false)
  const [editType, setEditType] = useState<'destinations' | 'tours' | 'hotels'>('destinations')
  const [editId, setEditId] = useState<string | number | null>(null) // null = create new
  const [modalTab, setModalTab] = useState<'overview' | 'itinerary' | 'amenities' | 'reviews' | 'advice'>('overview')
  const [contactTab, setContactTab] = useState<'banner' | 'channels' | 'footer'>('banner')
  const [aboutTab, setAboutTab] = useState<'philosophy' | 'stats' | 'pillars'>('philosophy')
  const [testimonialsTab, setTestimonialsTab] = useState<number>(0)

  // Form values
  const [destForm, setDestForm] = useState<Partial<Destination>>({})
  const [tourForm, setTourForm] = useState<Partial<Tour>>({})
  const [hotelForm, setHotelForm] = useState<Partial<LuxuryHotel>>({})
  const [aboutForm, setAboutForm] = useState<any>({})
  const [contactForm, setContactForm] = useState<any>({})
  const [testimonialsForm, setTestimonialsForm] = useState<any[]>([])
  const [touristForm, setTouristForm] = useState<any>({ name: "", nationality: "", passportNumber: "", email: "", phone: "", tourName: "", checkInDate: "", checkOutDate: "", sdfStatus: "Paid", specialRequests: "" })
  const [editTouristId, setEditTouristId] = useState<number | null>(null)
  const [showTouristModal, setShowTouristModal] = useState(false)

  const [adminKey, setAdminKey] = useState<string | null>(localStorage.getItem('ADMIN_API_KEY'))

  // Fetch all data
  const fetchData = async () => {
    setLoading(true)
    try {
      const [destRes, toursRes, hotelsRes, aboutRes, contactRes, testimonialsRes, touristsRes] = await Promise.all([
        fetch(`${API_BASE}/api/destinations`),
        fetch(`${API_BASE}/api/tours`),
        fetch(`${API_BASE}/api/hotels`),
        fetch(`${API_BASE}/api/about`),
        fetch(`${API_BASE}/api/contact`),
        fetch(`${API_BASE}/api/testimonials`),
        fetch(`${API_BASE}/api/tourists`)
      ])

      const destData = await destRes.json()
      const toursData = await toursRes.json()
      const hotelsData = await hotelsRes.json()
      const aboutData = await aboutRes.json()
      const contactData = await contactRes.json()
      const testimonialsData = await testimonialsRes.json()
      const touristsData = await touristsRes.json()

      setDestinations(destData)
      setTours(toursData)
      setHotels(hotelsData)
      setAboutForm(aboutData)
      setContactForm(contactData)
      setTestimonialsForm(testimonialsData)
      setTourists(touristsData)
    } catch (err: any) {
      console.error(err)
      showToast('Error loading data from server.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getAuthHeader = () => {
    const key = adminKey || localStorage.getItem('ADMIN_API_KEY') || '';
    return { 'Authorization': `Bearer ${key}` };
  }

  useEffect(() => {
    let key = localStorage.getItem('ADMIN_API_KEY')
    if (!key) {
      key = window.prompt('Please enter the Admin API Key to access the dashboard:')
      if (key) {
        localStorage.setItem('ADMIN_API_KEY', key)
        setAdminKey(key)
      } else {
        showToast('Access Denied: Admin API Key is required.', 'error')
      }
    }
    fetchData()
  }, [adminKey])

  const showToast = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  // DELETE handler
  const handleDelete = async (type: 'destinations' | 'tours' | 'hotels', id: string | number) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return

    try {
      const res = await fetch(`${API_BASE}/api/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader()
        }
      })
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('ADMIN_API_KEY')
          setAdminKey(null)
        }
        throw new Error('Delete failed')
      }

      showToast('Item deleted successfully!', 'success')
      fetchData()
    } catch (err: any) {
      showToast(err.message || 'Error deleting item.', 'error')
    }
  }

  // Edit opener
  const handleOpenEdit = (type: 'destinations' | 'tours' | 'hotels', item?: any) => {
    setEditType(type)
    if (item) {
      setEditId(item.id)
      if (type === 'destinations') {
        let text = item.description || ''
        let itinerary = [
          { day: "01", title: "Arrival in the Land of Thunder Dragon", detail: "Traditional welcome at Paro International Airport. Private luxury transfer to your valley-view suite. Welcome dinner with cultural performance." },
          { day: "02", title: "Sacred Monasteries & Hidden Arts", detail: "Early morning meditation session at Kyichu Lhakhang. Exclusive access to temple murals and traditional thangka painting workshop." },
          { day: "03", title: "Himalayan Ridge Expedition", detail: "A guided hike through rhododendron forests to a mountain monastery. High-altitude picnic with panoramic Himalayan peaks." },
          { day: "04", title: "Departure & Blessings", detail: "Morning prayer ceremony for safe travels. Final souvenir shopping at the local craft bazaar and transfer to Paro Airport." }
        ]
        let amenities = [
          { icon: "Sparkles", label: "Heritage Sanctuary", desc: "Private meditation room overlooking the valley with local incense." },
          { icon: "Wifi", label: "High-Speed Wi-Fi", desc: "Satellite internet connection throughout the premises for connectivity." },
          { icon: "Mountain", label: "Panoramic Terraces", desc: "Elevated viewing balconies with views of local Himalayan ridges." },
          { icon: "Bath", label: "Organic Spa & Baths", desc: "Traditional hot stone bath facilities using fresh mountain herbs." },
          { icon: "Car", label: "Bespoke Transfers", desc: "Assigned luxury SUV and driver for all localized tours and day trips." },
          { icon: "Utensils", label: "Artisanal Kitchen", desc: "In-house culinary experiences focusing on organic farm-to-table cuisine." }
        ]
        let reviews = [
          { name: "Elena Rostova", date: "April 2026", rating: 5, text: "Beyond luxury. The silence here is healing. Watching the sunrise from the terrace with hot butter tea is an experience I will carry with me forever. The staff treated us like royalty." },
          { name: "Marcus Thorne", date: "March 2026", rating: 5, text: "Incredibly well organized. The local guides are extremely knowledgeable. We got access to temple corridors that are usually closed to the public. Fully worth the journey." }
        ]

        try {
          if (item.description && item.description.trim().startsWith('{')) {
            const parsed = JSON.parse(item.description)
            if (parsed.text) text = parsed.text
            if (parsed.itinerary) itinerary = parsed.itinerary
            if (parsed.amenities) amenities = parsed.amenities
            if (parsed.reviews) reviews = parsed.reviews
          }
        } catch (e) {
          // ignore error
        }

        setDestForm({
          ...item,
          descriptionText: text,
          itinerary,
          amenities,
          reviews
        })
      } else if (type === 'tours') {
        let text = item.desc || ''
        let visaAdvice = ''
        let altitudeAdvice = ''
        let currencyAdvice = ''
        try {
          if (item.desc && item.desc.trim().startsWith('{')) {
            const parsed = JSON.parse(item.desc)
            if (parsed.text) text = parsed.text
            if (parsed.visaAdvice) visaAdvice = parsed.visaAdvice
            if (parsed.altitudeAdvice) altitudeAdvice = parsed.altitudeAdvice
            if (parsed.currencyAdvice) currencyAdvice = parsed.currencyAdvice
          }
        } catch (e) { }

        setTourForm({
          ...item,
          descText: text,
          visaAdvice,
          altitudeAdvice,
          currencyAdvice
        })
      } else if (type === 'hotels') {
        setHotelForm(item)
      }
    } else {
      setEditId(null)
      if (type === 'destinations') {
        setDestForm({
          name: '', image: '', description: '', price: '', rating: 4.8, location: '',
          descriptionText: '',
          itinerary: [
            { day: "01", title: "Arrival", detail: "Transfer and checking into hotel." },
            { day: "02", title: "Sightseeing", detail: "Exploring valley landmarks." },
            { day: "03", title: "Expedition", detail: "Guided trekking activity." },
            { day: "04", title: "Departure", detail: "Transfer to Paro Airport." }
          ],
          amenities: [
            { icon: "Sparkles", label: "Heritage Sanctuary", desc: "Private meditation room overlooking the valley with local incense." },
            { icon: "Wifi", label: "High-Speed Wi-Fi", desc: "Satellite internet connection throughout the premises for connectivity." },
            { icon: "Mountain", label: "Panoramic Terraces", desc: "Elevated viewing balconies with views of local Himalayan ridges." },
            { icon: "Bath", label: "Organic Spa & Baths", desc: "Traditional hot stone bath facilities using fresh mountain herbs." },
            { icon: "Car", label: "Bespoke Transfers", desc: "Assigned luxury SUV and driver for all localized tours and day trips." },
            { icon: "Utensils", label: "Artisanal Kitchen", desc: "In-house culinary experiences focusing organic farm-to-table cuisine." }
          ],
          reviews: [
            { name: "Elena Rostova", date: "April 2026", rating: 5, text: "Beyond luxury. The silence here is healing." }
          ]
        })
      } else if (type === 'tours') {
        setTourForm({
          id: '', title: '', duration: '', nights: 3, price: '', priceVal: 999, image: '',
          desc: '', category: 'Cultural', difficulty: 'Easy', inclusions: [], exclusions: [],
          itinerary: [
            { day: 1, title: 'Arrival', desc: 'Transfer and check into hotel.' },
            { day: 2, title: 'Sightseeing', desc: 'Exploring local sights.' },
            { day: 3, title: 'Departure', desc: 'Transfer to airport.' }
          ],
          descText: '',
          visaAdvice: '',
          altitudeAdvice: '',
          currencyAdvice: ''
        })
      } else if (type === 'hotels') {
        setHotelForm({
          name: '', location: '', image: '', rating: 5.0, price: '', description: ''
        })
      }
    }
    setModalTab('overview')
    setShowModal(true)
  }

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    let url = `${API_BASE}/api/${editType}`
    let method = 'POST'
    let bodyData: any = {}
    if (editType === 'destinations') {
      const compiledDescription = JSON.stringify({
        text: destForm.descriptionText || destForm.description || '',
        itinerary: destForm.itinerary || [],
        amenities: destForm.amenities || [],
        reviews: destForm.reviews || []
      })
      bodyData = {
        ...destForm,
        description: compiledDescription
      }
      delete bodyData.descriptionText
      delete bodyData.itinerary
      delete bodyData.amenities
      delete bodyData.reviews
    } else if (editType === 'tours') {
      const compiledDescription = JSON.stringify({
        text: tourForm.descText || tourForm.desc || '',
        visaAdvice: tourForm.visaAdvice || '',
        altitudeAdvice: tourForm.altitudeAdvice || '',
        currencyAdvice: tourForm.currencyAdvice || ''
      })
      bodyData = {
        ...tourForm,
        desc: compiledDescription
      }
      delete bodyData.descText
      delete bodyData.visaAdvice
      delete bodyData.altitudeAdvice
      delete bodyData.currencyAdvice
    } else if (editType === 'hotels') {
      bodyData = hotelForm
    }

    if (editId !== null) {
      url = `${API_BASE}/api/${editType}/${editId}`
      method = 'PUT'
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(bodyData)
      })

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('ADMIN_API_KEY')
          setAdminKey(null)
        }
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to save item')
      }

      showToast(editId !== null ? 'Item updated successfully!' : 'Item created successfully!', 'success')
      setShowModal(false)
      fetchData()
    } catch (err: any) {
      showToast(err.message || 'Error saving details.', 'error')
    }
  }

  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (file: File, type: 'destinations' | 'tours' | 'hotels' | 'testimonials', index?: number) => {
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64 = reader.result as string
        const res = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ name: file.name, data: base64 })
        })
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('ADMIN_API_KEY')
            setAdminKey(null)
          }
          throw new Error('Upload failed')
        }
        const data = await res.json()

        if (type === 'destinations') {
          setDestForm(prev => ({ ...prev, image: data.url }))
        } else if (type === 'tours') {
          setTourForm(prev => ({ ...prev, image: data.url }))
        } else if (type === 'hotels') {
          setHotelForm(prev => ({ ...prev, image: data.url }))
        } else if (type === 'testimonials' && typeof index === 'number') {
          setTestimonialsForm(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], avatar: data.url }
            return updated
          })
        }

        showToast('Image uploaded successfully!', 'success')
      }
    } catch (err: any) {
      console.error(err)
      showToast('Error uploading image.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveTestimonials = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/testimonials`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(testimonialsForm)
      })
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('ADMIN_API_KEY')
          setAdminKey(null)
        }
        throw new Error('Failed to save testimonials')
      }
      showToast('Customer reviews updated successfully!', 'success')
      fetchData()
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'Error saving testimonials.', 'error')
      setLoading(false)
    }
  }

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/about`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(aboutForm)
      })
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('ADMIN_API_KEY')
          setAdminKey(null)
        }
        throw new Error('Failed to save about details')
      }
      showToast('About content updated successfully!', 'success')
      fetchData()
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'Error saving details.', 'error')
      setLoading(false)
    }
  }

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(contactForm)
      })
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('ADMIN_API_KEY')
          setAdminKey(null)
        }
        throw new Error('Failed to save contact details')
      }
      showToast('Contact content updated successfully!', 'success')
      fetchData()
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'Error saving details.', 'error')
      setLoading(false)
    }
  }

  const handleSaveTourist = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    let url = `${API_BASE}/api/tourists`
    let method = 'POST'
    if (editTouristId !== null) {
      url = `${API_BASE}/api/tourists/${editTouristId}`
      method = 'PUT'
    }
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(touristForm)
      })
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('ADMIN_API_KEY')
          setAdminKey(null)
        }
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to save tourist details')
      }
      showToast(editTouristId !== null ? 'Tourist record updated successfully!' : 'Tourist registered successfully!', 'success')
      setShowTouristModal(false)
      fetchData()
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'Error saving tourist details.', 'error')
      setLoading(false)
    }
  }

  const ImageUploadField = ({ value, onChange, onUpload, label }: { value: string; onChange: (val: string) => void; onUpload: (file: File) => void; label: string }) => {
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onUpload(e.dataTransfer.files[0])
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        onUpload(e.target.files[0])
      }
    }

    return (
      <div className="col-span-1 md:col-span-2 space-y-2">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div
            className={`md:col-span-7 border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center transition-all ${dragActive ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400"
              }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id={`file-upload-${label.replace(/\s+/g, '-')}`}
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />
            <label
              htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
              className="cursor-pointer flex flex-col items-center space-y-2 w-full"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
                <Upload className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 block">
                  {uploading ? "Uploading..." : "Click to upload or drag & drop"}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">PNG, JPG, WEBP up to 5MB</span>
              </div>
            </label>
          </div>

          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Or paste external image URL..."
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-900"
              />
            </div>
            {value && (
              <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                <img src={value.startsWith('/') ? `${API_BASE}${value}` : value} alt="Preview" className="w-12 h-10 object-cover rounded-lg border border-slate-200 bg-white" />
                <div className="overflow-hidden flex-1">
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">Image Preview</span>
                  <span className="text-[10px] text-slate-600 font-mono truncate block">{value}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Helper sorting and filtering functions
  const getFilteredAndSortedData = () => {
    if (activeTab === 'destinations') {
      let result = [...destinations]
      if (searchQuery) {
        result = result.filter(d =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      if (sortBy === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating)
      } else if (sortBy === 'price') {
        result.sort((a, b) => {
          const valA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0
          const valB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0
          return valA - valB
        })
      }
      return result
    } else if (activeTab === 'tours') {
      let result = [...tours]
      if (searchQuery) {
        result = result.filter(t =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      if (sortBy === 'name') {
        result.sort((a, b) => a.title.localeCompare(b.title))
      } else if (sortBy === 'rating') {
        // Tours do not have ratings in type, skip or sort by duration
      } else if (sortBy === 'price') {
        result.sort((a, b) => a.priceVal - b.priceVal)
      }
      return result
    } else {
      let result = [...hotels]
      if (searchQuery) {
        result = result.filter(h =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      if (sortBy === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating)
      } else if (sortBy === 'price') {
        result.sort((a, b) => {
          const valA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0
          const valB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0
          return valA - valB
        })
      }
      return result
    }
  }

  const displayedItems = getFilteredAndSortedData()

  // Dynamic statistics calculations
  const totalDestinationsCount = destinations.length
  const totalToursCount = tours.length
  const totalHotelsCount = hotels.length


  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans">
      {/* Left Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center mb-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Bhutan CMS
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Help Tourism Bhutan Admin</p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 mb-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Content Management
            </div>

            <button
              onClick={() => { setActiveTab('destinations'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'destinations'
                  ? 'bg-slate-100 text-slate-900 border-l-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <MapPin className={`w-4 h-4 ${activeTab === 'destinations' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>Destinations</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${activeTab === 'destinations' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                {totalDestinationsCount}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('tours'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'tours'
                  ? 'bg-slate-100 text-slate-900 border-l-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Compass className={`w-4 h-4 ${activeTab === 'tours' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>Tours</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${activeTab === 'tours' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                {totalToursCount}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('hotels'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'hotels'
                  ? 'bg-slate-100 text-slate-900 border-l-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Hotel className={`w-4 h-4 ${activeTab === 'hotels' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>Hotels</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${activeTab === 'hotels' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                {totalHotelsCount}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('about'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'about'
                  ? 'bg-slate-100 text-slate-900 border-l-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <HelpCircle className={`w-4 h-4 ${activeTab === 'about' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>About Content</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('contact'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'contact'
                  ? 'bg-slate-100 text-slate-900 border-l-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Phone className={`w-4 h-4 ${activeTab === 'contact' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>Contact Content</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('testimonials'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'testimonials'
                  ? 'bg-slate-100 text-slate-900 border-l-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Star className={`w-4 h-4 ${activeTab === 'testimonials' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>Voice of the Valley</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('tourists'); setSearchQuery(''); }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'tourists'
                  ? 'bg-slate-100 text-slate-900 border-l-2 border-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center space-x-3">
                <Users className={`w-4 h-4 ${activeTab === 'tourists' ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>Tourist Logbook</span>
              </div>
            </button>

          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <Link
            to="/"
            className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen p-8">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <span>
                {activeTab === 'destinations'
                  ? 'Destinations'
                  : activeTab === 'tours'
                    ? 'Tours'
                    : activeTab === 'hotels'
                      ? 'Hotels'
                      : activeTab === 'about'
                        ? 'About Us'
                        : activeTab === 'contact'
                          ? 'Contact Us'
                          : activeTab === 'testimonials'
                            ? 'Voice of the Valley'
                            : 'Tourist Logbook'}
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
              <span className="text-slate-500 text-lg font-medium">Dashboard</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'about'
                ? 'Manage legacy stats, philosophy copy, and the four standards of integrity.'
                : activeTab === 'contact'
                  ? 'Manage office locations, phone channels, and support email addresses.'
                  : activeTab === 'testimonials'
                    ? 'Manage Voice of the Valley Customer Reviews displayed on the home page.'
                    : activeTab === 'tourists'
                      ? 'Manage database records and registration logbook of tourists who have visited Bhutan.'
                      : 'Manage database objects, details, ratings, and media galleries.'}
            </p>
          </div>

          {activeTab !== 'about' && activeTab !== 'contact' && activeTab !== 'testimonials' && (
            <button
              onClick={() => {
                if (activeTab === 'tourists') {
                  setTouristForm({ name: "", nationality: "", passportNumber: "", email: "", phone: "", tourName: "", checkInDate: "", checkOutDate: "", sdfStatus: "Paid", specialRequests: "" })
                  setEditTouristId(null)
                  setShowTouristModal(true)
                } else {
                  handleOpenEdit(activeTab as any)
                }
              }}
              className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-black text-white font-bold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Add New {activeTab === 'destinations' ? 'Destination' : activeTab === 'tours' ? 'Tour' : activeTab === 'hotels' ? 'Hotel' : 'Tourist'}</span>
            </button>
          )}
        </header>



        {/* Toast Notification */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`fixed top-8 right-8 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 border ${message.type === 'success'
                  ? 'bg-slate-900 border-slate-950 text-white'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
            >
              <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              <span className="text-sm font-semibold">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Block (Search & Sort) */}
        {activeTab !== 'about' && activeTab !== 'contact' && activeTab !== 'testimonials' && activeTab !== 'tourists' && (
          <div className="bg-white border border-slate-200 p-4 rounded-t-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-3">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="default">Default / ID</option>
                <option value="name">Name / Title</option>
                {activeTab !== 'tours' && <option value="rating">Rating</option>}
                <option value="price">Starting Price</option>
              </select>
            </div>
          </div>
        )}

        {/* Content list block */}
        {loading ? (
          <TableSkeleton rows={5} />
        ) : activeTab === 'about' ? (
          <form onSubmit={handleSaveAbout} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8 max-w-4xl mx-auto">
            {/* About Tab Navigation */}
            <div className="flex space-x-6 border-b border-slate-200 pb-2">
              {[
                { id: 'philosophy', label: 'Philosophy' },
                { id: 'stats', label: 'Key Statistics' },
                { id: 'pillars', label: 'Standards & Pillars' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAboutTab(tab.id as any)}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${aboutTab === tab.id
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-900'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: PHILOSOPHY */}
            {aboutTab === 'philosophy' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-405 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                  <span>Our Philosophy Copy</span>
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Philosophy Description</label>
                  <textarea
                    rows={6}
                    required
                    value={aboutForm.philosophyText || ''}
                    onChange={e => setAboutForm({ ...aboutForm, philosophyText: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                    placeholder="Describe your tour philosophy..."
                  />
                </div>
              </div>
            )}

            {/* TAB 2: KEY STATISTICS */}
            {aboutTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-405 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                  <span>Key Statistics (4 Items)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stat 1 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150/60 space-y-3">
                    <span className="text-xs font-bold text-slate-405 uppercase tracking-wider block">Statistic 1</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Value (e.g. 2010)</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.stat1Val || ''}
                          onChange={e => setAboutForm({ ...aboutForm, stat1Val: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Label (e.g. Founded)</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.stat1Label || ''}
                          onChange={e => setAboutForm({ ...aboutForm, stat1Label: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150/60 space-y-3">
                    <span className="text-xs font-bold text-slate-405 uppercase tracking-wider block">Statistic 2</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Value (e.g. 50+ Local)</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.stat2Val || ''}
                          onChange={e => setAboutForm({ ...aboutForm, stat2Val: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Label (e.g. Guides)</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.stat2Label || ''}
                          onChange={e => setAboutForm({ ...aboutForm, stat2Label: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150/60 space-y-3">
                    <span className="text-xs font-bold text-slate-405 uppercase tracking-wider block">Statistic 3</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Value (e.g. All 20 Dzongkhags)</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.stat3Val || ''}
                          onChange={e => setAboutForm({ ...aboutForm, stat3Val: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Label (e.g. Regions)</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.stat3Label || ''}
                          onChange={e => setAboutForm({ ...aboutForm, stat3Label: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stat 4 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150/60 space-y-3">
                    <span className="text-xs font-bold text-slate-405 uppercase tracking-wider block">Statistic 4</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Value (e.g. 100% GNH)</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.stat4Val || ''}
                          onChange={e => setAboutForm({ ...aboutForm, stat4Val: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Label (e.g. Happiness)</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.stat4Label || ''}
                          onChange={e => setAboutForm({ ...aboutForm, stat4Label: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STANDARDS & PILLARS */}
            {aboutTab === 'pillars' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-405 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                  <span>Standards of Integrity (4 Pillars)</span>
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {/* Pillar 1 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150/60 space-y-3">
                    <span className="text-xs font-bold text-slate-405 uppercase tracking-wider block">Pillar 1</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Title</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.pillar1Title || ''}
                          onChange={e => setAboutForm({ ...aboutForm, pillar1Title: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.pillar1Desc || ''}
                          onChange={e => setAboutForm({ ...aboutForm, pillar1Desc: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150/60 space-y-3">
                    <span className="text-xs font-bold text-slate-405 uppercase tracking-wider block">Pillar 2</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Title</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.pillar2Title || ''}
                          onChange={e => setAboutForm({ ...aboutForm, pillar2Title: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.pillar2Desc || ''}
                          onChange={e => setAboutForm({ ...aboutForm, pillar2Desc: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150/60 space-y-3">
                    <span className="text-xs font-bold text-slate-405 uppercase tracking-wider block">Pillar 3</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Title</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.pillar3Title || ''}
                          onChange={e => setAboutForm({ ...aboutForm, pillar3Title: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.pillar3Desc || ''}
                          onChange={e => setAboutForm({ ...aboutForm, pillar3Desc: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pillar 4 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150/60 space-y-3">
                    <span className="text-xs font-bold text-slate-405 uppercase tracking-wider block">Pillar 4</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Title</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.pillar4Title || ''}
                          onChange={e => setAboutForm({ ...aboutForm, pillar4Title: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                        <input
                          type="text"
                          required
                          value={aboutForm.pillar4Desc || ''}
                          onChange={e => setAboutForm({ ...aboutForm, pillar4Desc: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-slate-900 hover:bg-black text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>Save About Content</span>
              </button>
            </div>
          </form>
        ) : activeTab === 'contact' ? (
          <form onSubmit={handleSaveContact} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8 max-w-4xl mx-auto">
            {/* Contact Tab Navigation */}
            <div className="flex space-x-6 border-b border-slate-200 pb-2">
              {[
                { id: 'banner', label: 'Banner & Over-title' },
                { id: 'channels', label: 'Direct Channels' },
                { id: 'footer', label: 'Footer Settings' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setContactTab(tab.id as any)}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${contactTab === tab.id
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-900'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: BANNER & OVER-TITLE */}
            {contactTab === 'banner' && (
              <div className="space-y-8">
                {/* Section 1: Hero Banner copy */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-405 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                    <span>Hero Banner</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Hero Title</label>
                      <input
                        type="text"
                        required
                        value={contactForm.heroTitle || ''}
                        onChange={e => setContactForm({ ...contactForm, heroTitle: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Hero Subtitle</label>
                      <textarea
                        rows={3}
                        required
                        value={contactForm.heroSubtitle || ''}
                        onChange={e => setContactForm({ ...contactForm, heroSubtitle: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Direct Channels Section Copy */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-405 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                    <span>Direct Channels Info</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Section Over-title (e.g. Direct Channels)</label>
                      <input
                        type="text"
                        required
                        value={contactForm.channelTitle || ''}
                        onChange={e => setContactForm({ ...contactForm, channelTitle: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Section Title (e.g. How to Reach Us)</label>
                      <input
                        type="text"
                        required
                        value={contactForm.channelSubtitle || ''}
                        onChange={e => setContactForm({ ...contactForm, channelSubtitle: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description text</label>
                      <textarea
                        rows={3}
                        required
                        value={contactForm.channelDesc || ''}
                        onChange={e => setContactForm({ ...contactForm, channelDesc: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DIRECT CHANNELS DETAILS */}
            {contactTab === 'channels' && (
              <div className="space-y-8">
                {/* Section 3: The Base Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-405 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                    <span>The Base (Office Address)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Title (e.g. The Base)</label>
                      <input
                        type="text"
                        required
                        value={contactForm.baseTitle || ''}
                        onChange={e => setContactForm({ ...contactForm, baseTitle: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Address Line 1</label>
                      <input
                        type="text"
                        required
                        value={contactForm.baseLine1 || ''}
                        onChange={e => setContactForm({ ...contactForm, baseLine1: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Address Line 2</label>
                      <input
                        type="text"
                        required
                        value={contactForm.baseLine2 || ''}
                        onChange={e => setContactForm({ ...contactForm, baseLine2: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Phones */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-405 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                    <span>Digital Call (Phones)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Title (e.g. Digital Call)</label>
                      <input
                        type="text"
                        required
                        value={contactForm.callTitle || ''}
                        onChange={e => setContactForm({ ...contactForm, callTitle: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Phone Line 1</label>
                      <input
                        type="text"
                        required
                        value={contactForm.callLine1 || ''}
                        onChange={e => setContactForm({ ...contactForm, callLine1: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Phone Line 2</label>
                      <input
                        type="text"
                        required
                        value={contactForm.callLine2 || ''}
                        onChange={e => setContactForm({ ...contactForm, callLine2: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Emails */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-405 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                    <span>Electronic Mail (Emails)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Title (e.g. Electronic Mail)</label>
                      <input
                        type="text"
                        required
                        value={contactForm.emailTitle || ''}
                        onChange={e => setContactForm({ ...contactForm, emailTitle: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email Line 1</label>
                      <input
                        type="email"
                        required
                        value={contactForm.emailLine1 || ''}
                        onChange={e => setContactForm({ ...contactForm, emailLine1: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email Line 2</label>
                      <input
                        type="email"
                        required
                        value={contactForm.emailLine2 || ''}
                        onChange={e => setContactForm({ ...contactForm, emailLine2: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FOOTER CONTACT & SOCIALS */}
            {contactTab === 'footer' && (
              <div className="space-y-8">
                {/* Section 6: Footer Contact & Socials */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-405 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                    <span>Footer Contact Details</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Footer Phone</label>
                      <input
                        type="text"
                        required
                        value={contactForm.footerPhone || ''}
                        onChange={e => setContactForm({ ...contactForm, footerPhone: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Footer Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.footerEmail || ''}
                        onChange={e => setContactForm({ ...contactForm, footerEmail: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Footer WhatsApp</label>
                      <input
                        type="text"
                        required
                        value={contactForm.footerWhatsapp || ''}
                        onChange={e => setContactForm({ ...contactForm, footerWhatsapp: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Footer Location</label>
                      <input
                        type="text"
                        required
                        value={contactForm.footerLocation || ''}
                        onChange={e => setContactForm({ ...contactForm, footerLocation: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Networks labels */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-405 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                    <span>Social Media Labels</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Instagram Label</label>
                      <input
                        type="text"
                        required
                        value={contactForm.footerInstagram || ''}
                        onChange={e => setContactForm({ ...contactForm, footerInstagram: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Facebook Label</label>
                      <input
                        type="text"
                        required
                        value={contactForm.footerFacebook || ''}
                        onChange={e => setContactForm({ ...contactForm, footerFacebook: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">YouTube Label</label>
                      <input
                        type="text"
                        required
                        value={contactForm.footerYoutube || ''}
                        onChange={e => setContactForm({ ...contactForm, footerYoutube: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">TikTok Label</label>
                      <input
                        type="text"
                        required
                        value={contactForm.footerTiktok || ''}
                        onChange={e => setContactForm({ ...contactForm, footerTiktok: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-slate-900 hover:bg-black text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>Save Contact Content</span>
              </button>
            </div>
          </form>
        ) : activeTab === 'testimonials' ? (
          <form onSubmit={handleSaveTestimonials} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
                  <span>Voice of the Valley Customer Reviews</span>
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    const nextId = testimonialsForm.length > 0 ? Math.max(...testimonialsForm.map(t => t.id || 0)) + 1 : 1
                    const newTestimonial = {
                      id: nextId,
                      name: '',
                      role: '',
                      content: '',
                      avatar: 'https://i.pravatar.cc/200?u=new' + nextId,
                      rating: 5
                    }
                    const updated = [...testimonialsForm, newTestimonial]
                    setTestimonialsForm(updated)
                    setTestimonialsTab(updated.length - 1)
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition cursor-pointer self-start"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>

              {/* Review Tabs Navigation */}
              {testimonialsForm.length > 0 ? (
                <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
                  {testimonialsForm.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTestimonialsTab(idx)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border cursor-pointer ${testimonialsTab === idx
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                        }`}
                    >
                      Review #{idx + 1}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="space-y-8">
                {testimonialsForm.length > 0 && testimonialsForm[testimonialsTab] ? (
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Review #{testimonialsTab + 1} Settings</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete Review #${testimonialsTab + 1}?`)) {
                            const updated = [...testimonialsForm]
                            updated.splice(testimonialsTab, 1)
                            setTestimonialsForm(updated)
                            setTestimonialsTab(Math.max(0, testimonialsTab - 1))
                          }
                        }}
                        className="flex items-center space-x-1 px-2.5 py-1 text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold uppercase tracking-wider transition cursor-pointer border border-rose-250"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Review</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Customer Name</label>
                        <input
                          type="text"
                          required
                          value={testimonialsForm[testimonialsTab].name || ''}
                          onChange={e => {
                            const updated = [...testimonialsForm]
                            updated[testimonialsTab] = { ...updated[testimonialsTab], name: e.target.value }
                            setTestimonialsForm(updated)
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Role / Bio (e.g. Cultural Historian • Thimphu Resident)</label>
                        <input
                          type="text"
                          required
                          value={testimonialsForm[testimonialsTab].role || ''}
                          onChange={e => {
                            const updated = [...testimonialsForm]
                            updated[testimonialsTab] = { ...updated[testimonialsTab], role: e.target.value }
                            setTestimonialsForm(updated)
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Review Content</label>
                        <textarea
                          rows={3}
                          required
                          value={testimonialsForm[testimonialsTab].content || testimonialsForm[testimonialsTab].text || ''}
                          onChange={e => {
                            const updated = [...testimonialsForm]
                            updated[testimonialsTab] = { ...updated[testimonialsTab], content: e.target.value, text: e.target.value }
                            setTestimonialsForm(updated)
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Rating (1 to 5 Stars)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          required
                          value={testimonialsForm[testimonialsTab].rating || 5}
                          onChange={e => {
                            const updated = [...testimonialsForm]
                            updated[testimonialsTab] = { ...updated[testimonialsTab], rating: parseInt(e.target.value) || 5 }
                            setTestimonialsForm(updated)
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <ImageUploadField
                          label={`Avatar Photo for Review #${testimonialsTab + 1}`}
                          value={testimonialsForm[testimonialsTab].avatar || ''}
                          onChange={val => {
                            const updated = [...testimonialsForm]
                            updated[testimonialsTab] = { ...updated[testimonialsTab], avatar: val }
                            setTestimonialsForm(updated)
                          }}
                          onUpload={file => handleFileUpload(file, 'testimonials', testimonialsTab)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                    <span className="text-xs text-slate-400 font-semibold block">No customer reviews configured</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Click the "Add Review" button above to get started.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {testimonialsForm.length > 0 && (
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-black text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Customer Reviews</span>
                </button>
              </div>
            )}
          </form>
        ) : activeTab === 'tourists' ? (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Himalayan Tourist Registry</h3>
              <p className="text-xs text-slate-500 mt-1">Official logbook of tourists entering the Kingdom of Bhutan.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/70">
                    <th className="p-4 pl-6">Name & Nationality</th>
                    <th className="p-4">Contact Details</th>
                    <th className="p-4">Tour / Package</th>
                    <th className="p-4">Stay Dates</th>
                    <th className="p-4">SDF Status</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {tourists.length > 0 ? (
                    tourists.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-semibold text-slate-950">{t.name}</div>
                          <div className="text-xs text-slate-400 font-light mt-0.5">{t.nationality} • PP: {t.passportNumber}</div>
                        </td>
                        <td className="p-4">
                          <div>{t.email}</div>
                          <div className="text-xs text-slate-400 font-light mt-0.5">{t.phone}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-800">{t.tourName}</td>
                        <td className="p-4 text-xs">
                          <div>In: {t.checkInDate}</div>
                          <div className="mt-0.5 text-slate-400">Out: {t.checkOutDate}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            t.sdfStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {t.sdfStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6 space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTouristForm(t)
                              setEditTouristId(t.id)
                              setShowTouristModal(true)
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 cursor-pointer inline-block"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete ${t.name} from the logbook?`)) {
                                try {
                                  const res = await fetch(`${API_BASE}/api/tourists/${t.id}`, {
                                    method: 'DELETE',
                                    headers: getAuthHeader()
                                  })
                                  if (!res.ok) throw new Error("Failed to delete tourist")
                                  setTourists(prev => prev.filter(item => item.id !== t.id))
                                  showToast(`${t.name} deleted from logbook.`, 'success')
                                } catch (e: any) {
                                  showToast(e.message || "Error deleting tourist", "error")
                                }
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 rounded text-rose-400 hover:text-rose-600 cursor-pointer inline-block"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-light italic">No registered tourists in the database yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white border-x border-b border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
            {displayedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-white">
                <HelpCircle className="w-12 h-12 text-slate-355 mb-3" />
                <p className="text-slate-500 font-semibold text-sm">No items matching your query</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing your filters or adding a new record.</p>
              </div>
            ) : (
              <>
                {/* DESTINATIONS LIST */}
                {activeTab === 'destinations' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-550 text-xs font-semibold uppercase tracking-wider">
                        <th className="p-4 w-20 pl-6">ID</th>
                        <th className="p-4">Name & Description</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(displayedItems as Destination[]).map(d => (
                        <tr key={d.id} className="hover:bg-slate-50/70 transition-all duration-150">
                          <td className="p-4 font-mono text-slate-400 pl-6 text-sm">{d.id}</td>
                          <td className="p-4 flex items-center space-x-3">
                            <img src={d.image} alt={d.name} className="w-12 h-10 object-cover rounded-lg border border-slate-200 bg-slate-100" />
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{d.name}</p>
                              <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{d.description}</p>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 text-sm">{d.location}</td>
                          <td className="p-4 text-emerald-600 font-bold text-sm">{d.price}</td>
                          <td className="p-4 text-slate-705 text-sm">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                              <span className="font-semibold">{d.rating}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <div className="flex justify-end items-center space-x-1">
                              <button
                                onClick={() => handleOpenEdit('destinations', d)}
                                className="p-2 hover:bg-slate-100 text-slate-700 hover:text-black rounded-lg transition cursor-pointer"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('destinations', d.id)}
                                className="p-2 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* TOURS LIST */}
                {activeTab === 'tours' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-550 text-xs font-semibold uppercase tracking-wider">
                        <th className="p-4 w-28 pl-6">Tour Code</th>
                        <th className="p-4">Title & Details</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Difficulty</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(displayedItems as Tour[]).map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/70 transition-all duration-150">
                          <td className="p-4 font-mono text-slate-700 pl-6 text-sm">{t.id}</td>
                          <td className="p-4 flex items-center space-x-3">
                            <img src={t.image} alt={t.title} className="w-12 h-10 object-cover rounded-lg border border-slate-200 bg-slate-100" />
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{t.title}</p>
                              <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{t.desc}</p>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 text-sm">{t.duration} ({t.nights} Nights)</td>
                          <td className="p-4 text-emerald-600 font-bold text-sm">{t.price}</td>
                          <td className="p-4 text-slate-600 text-sm">{t.category}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-slate-100 text-slate-750 border-slate-200">
                              {t.difficulty}
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <div className="flex justify-end items-center space-x-1">
                              <button
                                onClick={() => handleOpenEdit('tours', t)}
                                className="p-2 hover:bg-slate-100 text-slate-700 hover:text-black rounded-lg transition cursor-pointer"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('tours', t.id)}
                                className="p-2 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* HOTELS LIST */}
                {activeTab === 'hotels' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-550 text-xs font-semibold uppercase tracking-wider">
                        <th className="p-4 w-20 pl-6">ID</th>
                        <th className="p-4">Name & Description</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Starting Rate</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(displayedItems as LuxuryHotel[]).map(h => (
                        <tr key={h.id} className="hover:bg-slate-50/70 transition-all duration-150">
                          <td className="p-4 font-mono text-slate-400 pl-6 text-sm">{h.id}</td>
                          <td className="p-4 flex items-center space-x-3">
                            <img src={h.image} alt={h.name} className="w-12 h-10 object-cover rounded-lg border border-slate-200 bg-slate-100" />
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{h.name}</p>
                              <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{h.description}</p>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 text-sm">{h.location}</td>
                          <td className="p-4 text-emerald-600 font-bold text-sm">{h.price} <span className="text-xs text-slate-400 font-medium">/ Night</span></td>
                          <td className="p-4 text-slate-705 text-sm">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                              <span className="font-semibold">{h.rating}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <div className="flex justify-end items-center space-x-1">
                              <button
                                onClick={() => handleOpenEdit('hotels', h)}
                                className="p-2 hover:bg-slate-100 text-slate-700 hover:text-black rounded-lg transition cursor-pointer"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('hotels', h.id)}
                                className="p-2 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-md flex justify-center items-start py-12 px-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-slate-50 px-6 py-4.5 flex items-center justify-between border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <span className="text-slate-600">{editId !== null ? 'Modify' : 'Create'}</span>
                    <span>{editType.slice(0, -1)} Record</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Fill in the fields below. Required values must be completed.</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 hover:bg-slate-200 text-slate-405 hover:text-slate-900 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-6 space-y-6">

                {/* DESTINATION FORM FIELDS */}
                {editType === 'destinations' && (
                  <div className="space-y-6">
                    {/* Modal Tab Buttons */}
                    <div className="flex space-x-6 border-b border-slate-200 pb-2 mb-4">
                      {(['overview', 'itinerary', 'amenities', 'reviews'] as const).map(tab => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setModalTab(tab)}
                          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${modalTab === tab
                              ? 'border-slate-900 text-slate-900'
                              : 'border-transparent text-slate-400 hover:text-slate-900'
                            }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {modalTab === 'overview' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Destination Name</label>
                          <input
                            type="text"
                            required
                            value={destForm.name || ''}
                            onChange={e => setDestForm({ ...destForm, name: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Valleys / Location</label>
                          <input
                            type="text"
                            required
                            value={destForm.location || ''}
                            onChange={e => setDestForm({ ...destForm, location: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Starting Price (e.g. $120)</label>
                          <input
                            type="text"
                            required
                            value={destForm.price || ''}
                            onChange={e => setDestForm({ ...destForm, price: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <ImageUploadField
                          label="Destination Photo"
                          value={destForm.image || ''}
                          onChange={val => setDestForm({ ...destForm, image: val })}
                          onUpload={file => handleFileUpload(file, 'destinations')}
                        />
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Rating (1.0 to 5.0)</label>
                          <input
                            type="number"
                            step="0.1"
                            max="5"
                            min="1"
                            required
                            value={destForm.rating || ''}
                            onChange={e => setDestForm({ ...destForm, rating: parseFloat(e.target.value) })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                          <textarea
                            required
                            rows={3}
                            value={destForm.descriptionText || destForm.description || ''}
                            onChange={e => setDestForm({ ...destForm, descriptionText: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                      </div>
                    )}

                    {modalTab === 'itinerary' && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Itinerary</h4>
                        {(destForm.itinerary || []).map((it: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group">
                            <button
                              type="button"
                              onClick={() => {
                                const newIt = [...(destForm.itinerary || [])];
                                newIt.splice(idx, 1);
                                setDestForm({ ...destForm, itinerary: newIt });
                              }}
                              className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1 hover:bg-slate-200 rounded transition cursor-pointer"
                              title="Delete Day"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-6 gap-3">
                              <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Day</label>
                                <input
                                  type="text"
                                  value={it.day || ''}
                                  onChange={e => {
                                    const newIt = [...(destForm.itinerary || [])];
                                    newIt[idx] = { ...newIt[idx], day: e.target.value };
                                    setDestForm({ ...destForm, itinerary: newIt });
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                                />
                              </div>
                              <div className="col-span-5">
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Title</label>
                                <input
                                  type="text"
                                  value={it.title || ''}
                                  onChange={e => {
                                    const newIt = [...(destForm.itinerary || [])];
                                    newIt[idx] = { ...newIt[idx], title: e.target.value };
                                    setDestForm({ ...destForm, itinerary: newIt });
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Details</label>
                              <textarea
                                rows={2}
                                value={it.detail || ''}
                                onChange={e => {
                                  const newIt = [...(destForm.itinerary || [])];
                                  newIt[idx] = { ...newIt[idx], detail: e.target.value };
                                  setDestForm({ ...destForm, itinerary: newIt });
                                }}
                                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const nextDay = String((destForm.itinerary || []).length + 1).padStart(2, '0');
                            setDestForm({
                              ...destForm,
                              itinerary: [...(destForm.itinerary || []), { day: nextDay, title: '', detail: '' }]
                            });
                          }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Day</span>
                        </button>
                      </div>
                    )}

                    {modalTab === 'amenities' && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Amenities</h4>
                        {(destForm.amenities || []).map((am: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group">
                            <button
                              type="button"
                              onClick={() => {
                                const newAm = [...(destForm.amenities || [])];
                                newAm.splice(idx, 1);
                                setDestForm({ ...destForm, amenities: newAm });
                              }}
                              className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1 hover:bg-slate-200 rounded transition cursor-pointer"
                              title="Delete Amenity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Icon</label>
                                <select
                                  value={am.icon || 'Sparkles'}
                                  onChange={e => {
                                    const newAm = [...(destForm.amenities || [])];
                                    newAm[idx] = { ...newAm[idx], icon: e.target.value };
                                    setDestForm({ ...destForm, amenities: newAm });
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer"
                                >
                                  <option value="Sparkles">Sparkles (Sanctuary)</option>
                                  <option value="Wifi">Wifi (Internet)</option>
                                  <option value="Mountain">Mountain (View)</option>
                                  <option value="Bath">Bath (Spa)</option>
                                  <option value="Car">Car (SUV/Transfers)</option>
                                  <option value="Utensils">Utensils (Kitchen)</option>
                                </select>
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Label</label>
                                <input
                                  type="text"
                                  value={am.label || ''}
                                  onChange={e => {
                                    const newAm = [...(destForm.amenities || [])];
                                    newAm[idx] = { ...newAm[idx], label: e.target.value };
                                    setDestForm({ ...destForm, amenities: newAm });
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Description</label>
                              <input
                                type="text"
                                value={am.desc || ''}
                                onChange={e => {
                                  const newAm = [...(destForm.amenities || [])];
                                  newAm[idx] = { ...newAm[idx], desc: e.target.value };
                                  setDestForm({ ...destForm, amenities: newAm });
                                }}
                                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setDestForm({
                              ...destForm,
                              amenities: [...(destForm.amenities || []), { icon: 'Sparkles', label: '', desc: '' }]
                            });
                          }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Amenity</span>
                        </button>
                      </div>
                    )}

                    {modalTab === 'reviews' && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Reviews</h4>
                        {(destForm.reviews || []).map((rv: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group">
                            <button
                              type="button"
                              onClick={() => {
                                const newRv = [...(destForm.reviews || [])];
                                newRv.splice(idx, 1);
                                setDestForm({ ...destForm, reviews: newRv });
                              }}
                              className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1 hover:bg-slate-200 rounded transition cursor-pointer"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Reviewer Name</label>
                                <input
                                  type="text"
                                  value={rv.name || ''}
                                  onChange={e => {
                                    const newRv = [...(destForm.reviews || [])];
                                    newRv[idx] = { ...newRv[idx], name: e.target.value };
                                    setDestForm({ ...destForm, reviews: newRv });
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Date</label>
                                <input
                                  type="text"
                                  value={rv.date || ''}
                                  onChange={e => {
                                    const newRv = [...(destForm.reviews || [])];
                                    newRv[idx] = { ...newRv[idx], date: e.target.value };
                                    setDestForm({ ...destForm, reviews: newRv });
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Rating (1 to 5)</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={rv.rating || 5}
                                  onChange={e => {
                                    const newRv = [...(destForm.reviews || [])];
                                    newRv[idx] = { ...newRv[idx], rating: parseInt(e.target.value) || 5 };
                                    setDestForm({ ...destForm, reviews: newRv });
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Comment Text</label>
                              <textarea
                                rows={2}
                                value={rv.text || ''}
                                onChange={e => {
                                  const newRv = [...(destForm.reviews || [])];
                                  newRv[idx] = { ...newRv[idx], text: e.target.value };
                                  setDestForm({ ...destForm, reviews: newRv });
                                }}
                                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                            setDestForm({
                              ...destForm,
                              reviews: [...(destForm.reviews || []), { name: '', date: currentDate, rating: 5, text: '' }]
                            });
                          }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Review</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {editType === 'tours' && (
                  <div className="space-y-6">
                    {/* Modal Tab Buttons */}
                    <div className="flex space-x-6 border-b border-slate-200 pb-2 mb-4">
                      {(['overview', 'itinerary', 'advice'] as const).map(tab => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setModalTab(tab as any)}
                          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${modalTab === tab
                              ? 'border-slate-900 text-slate-900'
                              : 'border-transparent text-slate-400 hover:text-slate-900'
                            }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {modalTab === 'overview' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {editId === null && (
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Unique Tour Code (slug, e.g. custom-expedition)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. eco-bhutan-trek"
                              value={tourForm.id || ''}
                              onChange={e => setTourForm({ ...tourForm, id: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200 font-mono"
                            />
                          </div>
                        )}
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Tour Title</label>
                          <input
                            type="text"
                            required
                            value={tourForm.title || ''}
                            onChange={e => setTourForm({ ...tourForm, title: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Duration text (e.g. 5 Days)</label>
                          <input
                            type="text"
                            required
                            value={tourForm.duration || ''}
                            onChange={e => setTourForm({ ...tourForm, duration: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Nights (Integer count)</label>
                          <input
                            type="number"
                            required
                            value={tourForm.nights || 0}
                            onChange={e => setTourForm({ ...tourForm, nights: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Price tag (e.g. $1,299)</label>
                          <input
                            type="text"
                            required
                            value={tourForm.price || ''}
                            onChange={e => setTourForm({ ...tourForm, price: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Numerical price value (e.g. 1299)</label>
                          <input
                            type="number"
                            required
                            value={tourForm.priceVal || 0}
                            onChange={e => setTourForm({ ...tourForm, priceVal: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <ImageUploadField
                          label="Tour Photo"
                          value={tourForm.image || ''}
                          onChange={val => setTourForm({ ...tourForm, image: val })}
                          onUpload={file => handleFileUpload(file, 'tours')}
                        />
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Category</label>
                          <select
                            value={tourForm.category || 'Cultural'}
                            onChange={e => setTourForm({ ...tourForm, category: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer"
                          >
                            <option value="Cultural">Cultural</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Trekking">Trekking</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Difficulty</label>
                          <select
                            value={tourForm.difficulty || 'Easy'}
                            onChange={e => setTourForm({ ...tourForm, difficulty: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Challenging">Challenging</option>
                          </select>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description Summary</label>
                          <textarea
                            required
                            rows={2}
                            value={tourForm.descText || tourForm.desc || ''}
                            onChange={e => setTourForm({ ...tourForm, descText: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Inclusions (one per line)</label>
                          <textarea
                            rows={3}
                            placeholder="TCB Certified guide&#10;Meals&#10;Transfers"
                            value={tourForm.inclusions?.join('\n') || ''}
                            onChange={e => setTourForm({ ...tourForm, inclusions: e.target.value.split('\n').filter(Boolean) })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200 font-mono"
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Exclusions (one per line)</label>
                          <textarea
                            rows={3}
                            placeholder="Flights&#10;Insurance&#10;Personal tips"
                            value={tourForm.exclusions?.join('\n') || ''}
                            onChange={e => setTourForm({ ...tourForm, exclusions: e.target.value.split('\n').filter(Boolean) })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {modalTab === 'itinerary' && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Daily Itinerary</h4>
                        {(tourForm.itinerary || []).map((it: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group">
                            <button
                              type="button"
                              onClick={() => {
                                const newIt = [...(tourForm.itinerary || [])];
                                newIt.splice(idx, 1);
                                setTourForm({ ...tourForm, itinerary: newIt });
                              }}
                              className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 p-1 hover:bg-slate-200 rounded transition cursor-pointer"
                              title="Delete Day"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-6 gap-3">
                              <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Day</label>
                                <input
                                  type="number"
                                  value={it.day || ''}
                                  onChange={e => {
                                    const newIt = [...(tourForm.itinerary || [])];
                                    newIt[idx] = { ...newIt[idx], day: parseInt(e.target.value) || (idx + 1) };
                                    setTourForm({ ...tourForm, itinerary: newIt });
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                                />
                              </div>
                              <div className="col-span-5">
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Title</label>
                                <input
                                  type="text"
                                  value={it.title || ''}
                                  onChange={e => {
                                    const newIt = [...(tourForm.itinerary || [])];
                                    newIt[idx] = { ...newIt[idx], title: e.target.value };
                                    setTourForm({ ...tourForm, itinerary: newIt });
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Description</label>
                              <textarea
                                rows={2}
                                value={it.desc || ''}
                                onChange={e => {
                                  const newIt = [...(tourForm.itinerary || [])];
                                  newIt[idx] = { ...newIt[idx], desc: e.target.value };
                                  setTourForm({ ...tourForm, itinerary: newIt });
                                }}
                                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const nextDay = (tourForm.itinerary || []).length + 1;
                            setTourForm({
                              ...tourForm,
                              itinerary: [...(tourForm.itinerary || []), { day: nextDay, title: '', desc: '' }]
                            });
                          }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Day</span>
                        </button>
                      </div>
                    )}

                    {modalTab === 'advice' && (
                      <div className="space-y-5">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Practical Advice</h4>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Bhutan Entry Visa & Permit</label>
                          <textarea
                            rows={3}
                            value={tourForm.visaAdvice || ''}
                            onChange={e => setTourForm({ ...tourForm, visaAdvice: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Altitude & Packing Information</label>
                          <textarea
                            rows={3}
                            value={tourForm.altitudeAdvice || ''}
                            onChange={e => setTourForm({ ...tourForm, altitudeAdvice: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Currency & Connectivity</label>
                          <textarea
                            rows={3}
                            value={tourForm.currencyAdvice || ''}
                            onChange={e => setTourForm({ ...tourForm, currencyAdvice: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* HOTEL FORM FIELDS */}
                {editType === 'hotels' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Hotel Name</label>
                      <input
                        type="text"
                        required
                        value={hotelForm.name || ''}
                        onChange={e => setHotelForm({ ...hotelForm, name: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Location Details</label>
                      <input
                        type="text"
                        required
                        value={hotelForm.location || ''}
                        onChange={e => setHotelForm({ ...hotelForm, location: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Starting Rate per Night (e.g. $1,800)</label>
                      <input
                        type="text"
                        required
                        value={hotelForm.price || ''}
                        onChange={e => setHotelForm({ ...hotelForm, price: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                    <ImageUploadField
                      label="Hotel Photo"
                      value={hotelForm.image || ''}
                      onChange={val => setHotelForm({ ...hotelForm, image: val })}
                      onUpload={file => handleFileUpload(file, 'hotels')}
                    />
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Rating (1.0 to 5.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        max="5"
                        min="1"
                        required
                        value={hotelForm.rating || ''}
                        onChange={e => setHotelForm({ ...hotelForm, rating: parseFloat(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={hotelForm.description || ''}
                        onChange={e => setHotelForm({ ...hotelForm, description: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                      />
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex justify-end space-x-3 pt-4.5 border-t border-slate-205">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-all text-sm font-semibold cursor-pointer active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-lg transition-all cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save {editType.slice(0, -1)}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showTouristModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-md flex justify-center items-start py-12 px-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-slate-50 px-6 py-4.5 flex items-center justify-between border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <span className="text-slate-600">{editTouristId !== null ? 'Modify' : 'Register'}</span>
                    <span>Tourist Entry</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Please provide all necessary details for tourist visa registry.</p>
                </div>
                <button
                  onClick={() => setShowTouristModal(false)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-900 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveTourist} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={touristForm.name || ''}
                      onChange={e => setTouristForm({ ...touristForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Nationality</label>
                    <input
                      type="text"
                      required
                      value={touristForm.nationality || ''}
                      onChange={e => setTouristForm({ ...touristForm, nationality: e.target.value })}
                      placeholder="e.g. American"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Passport Number</label>
                    <input
                      type="text"
                      required
                      value={touristForm.passportNumber || ''}
                      onChange={e => setTouristForm({ ...touristForm, passportNumber: e.target.value })}
                      placeholder="e.g. A1234567"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={touristForm.email || ''}
                      onChange={e => setTouristForm({ ...touristForm, email: e.target.value })}
                      placeholder="e.g. john@doe.com"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={touristForm.phone || ''}
                      onChange={e => setTouristForm({ ...touristForm, phone: e.target.value })}
                      placeholder="e.g. +1-202-555-0143"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Selected Tour / Package</label>
                    <input
                      type="text"
                      required
                      value={touristForm.tourName || ''}
                      onChange={e => setTouristForm({ ...touristForm, tourName: e.target.value })}
                      placeholder="e.g. 4 Days Bhutan Highlights"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Check-in Date</label>
                    <input
                      type="date"
                      required
                      value={touristForm.checkInDate || ''}
                      onChange={e => setTouristForm({ ...touristForm, checkInDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Check-out Date</label>
                    <input
                      type="date"
                      required
                      value={touristForm.checkOutDate || ''}
                      onChange={e => setTouristForm({ ...touristForm, checkOutDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">SDF Status</label>
                    <select
                      value={touristForm.sdfStatus || 'Paid'}
                      onChange={e => setTouristForm({ ...touristForm, sdfStatus: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Special Requests / Notes</label>
                    <textarea
                      rows={3}
                      value={touristForm.specialRequests || ''}
                      onChange={e => setTouristForm({ ...touristForm, specialRequests: e.target.value })}
                      placeholder="Any dietary restrictions, medical conditions or VIP requests..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowTouristModal(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-all text-sm font-semibold cursor-pointer active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-lg transition-all cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Registry</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard
