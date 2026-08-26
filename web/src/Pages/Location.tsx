const VR_TOUR_URL = 'https://futeservices.com/26-27/Featherlight/VR%204/index.html'

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
