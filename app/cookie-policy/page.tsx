const CookiePolicyPage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">NextWear.ai Cookie Policy</h1>

      <p className="mb-4">
        This Cookie Policy explains how NextWear.ai uses cookies and similar technologies to recognize you when you
        visit our website at NextWear.ai. It explains what these technologies are and why we use them, as well as your
        rights to control our use of them.
      </p>

      <p className="mb-4">
        Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies
        are widely used by website owners in order to make their websites work, or to work more efficiently, as well as
        to provide reporting information.
      </p>

      <p className="mb-4">
        We use first and third-party cookies for several reasons. Some cookies are required for our website to operate
        for technical reasons, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also
        enable us to track and target the interests of our users to enhance the experience on our online properties.
        Third parties serve cookies through our website for advertising, analytics, and other purposes. This is
        described in more detail below.
      </p>

      <p className="mb-4">
        The specific types of first and third-party cookies served through our website and the purposes they perform are
        described in the table below (please note that the specific cookies served may vary depending on the particular
        online properties you are visiting):
      </p>

      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Cookie Name</th>
            <th className="px-4 py-2">Purpose</th>
            <th className="px-4 py-2">Provider</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">_ga</td>
            <td className="border px-4 py-2">Used to distinguish users.</td>
            <td className="border px-4 py-2">Google Analytics</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">_gid</td>
            <td className="border px-4 py-2">Used to distinguish users.</td>
            <td className="border px-4 py-2">Google Analytics</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">_gat</td>
            <td className="border px-4 py-2">Used to throttle request rate.</td>
            <td className="border px-4 py-2">Google Analytics</td>
          </tr>
        </tbody>
      </table>

      <p className="mb-4">
        You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access
        cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible
        or not function properly.
      </p>

      <p className="mb-4">For more information about the cookies we use, please contact us at: info@nextwear.ai</p>

      <p className="mb-4">This Cookie Policy was last updated on October 26, 2023.</p>
    </div>
  )
}

export default CookiePolicyPage
