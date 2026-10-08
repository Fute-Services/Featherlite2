const VR_TOUR_URL = 'https://featherl.vercel.app/'

const Location = () => (
  <section className="h-dvh w-full">
    <iframe
      src={VR_TOUR_URL}
      title="Featherlite Signature Location VR Tour"
      className="h-full w-full border-0"
      allow="accelerometer; gyroscope; fullscreen"
      allowFullScreen
    />
  </section>
)

export default Location
