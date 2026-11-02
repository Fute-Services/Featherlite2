// Local copy of the Pano2VR tour (public/location-tour) so it also works offline.
// Source of the copy: https://featherl.vercel.app/ - re-mirror it if that tour changes.
const VR_TOUR_URL = '/location-tour/index.html'

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
