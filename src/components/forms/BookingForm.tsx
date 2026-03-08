import React from "react"

const BookingForm: React.FC = () => (
  <section className="py-16 px-6 bg-gray-100 max-w-2xl mx-auto rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold mb-6 text-center">Book Your Trip</h2>
    <form className="flex flex-col gap-4">
      <input type="text" placeholder="Full Name" className="p-3 rounded border" />
      <input type="email" placeholder="Email" className="p-3 rounded border" />
      <input type="text" placeholder="Destination" className="p-3 rounded border" />
      <input type="date" className="p-3 rounded border" />
      <textarea placeholder="Special Requests" className="p-3 rounded border" />
      <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
        Submit Booking
      </button>
    </form>
  </section>
)

export default BookingForm