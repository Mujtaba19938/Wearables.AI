import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 pb-20">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">About wearables.ai</h1>
          </div>
          <Logo size="sm" />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              wearables.ai was created to help people find eyeglasses that perfectly complement their unique facial
              features. We believe that the right pair of glasses can enhance your appearance and boost your confidence.
            </p>
            <p className="mt-4">
              Our AI-powered technology analyzes your face shape and provides personalized recommendations based on
              optical styling principles that have been refined over decades in the eyewear industry.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our application uses advanced facial recognition technology to analyze your face's proportions and
              determine your face shape. The AI identifies key facial landmarks and calculates ratios between different
              features to classify your face as oval, round, square, heart, or diamond-shaped.
            </p>
            <p className="mt-4">
              Based on this analysis, we recommend eyeglass styles that are known to complement your specific face
              shape, following established principles of balance and proportion in eyewear selection.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We take your privacy seriously. All face analysis is performed directly in your browser using client-side
              processing. Your photos are never stored on our servers or shared with third parties.
            </p>
            <p className="mt-4">
              The facial recognition models run locally on your device, ensuring that your personal data remains private
              and secure.
            </p>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Card className="mb-8">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How accurate is the face shape analysis?</AccordionTrigger>
                <AccordionContent>
                  Our face shape analyzer uses advanced facial recognition technology to identify key facial landmarks
                  and calculate proportions. While it's highly accurate for most users (approximately 90% accuracy),
                  factors like lighting, angle, and hair coverage can affect results. For the most accurate analysis,
                  follow our tips for taking a good photo with proper lighting and a clear view of your entire face.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Are my photos stored anywhere?</AccordionTrigger>
                <AccordionContent>
                  No, your privacy is our priority. All face analysis is performed directly in your browser using
                  client-side processing. Your photos are never uploaded to our servers, stored in databases, or shared
                  with third parties. The facial recognition models run locally on your device, and all data is
                  discarded once you close the application or navigate away from the page.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What technology powers the face analysis?</AccordionTrigger>
                <AccordionContent>
                  Our application uses TensorFlow.js and face-api.js, which are open-source machine learning libraries
                  that run directly in your web browser. These technologies allow us to detect facial landmarks and
                  analyze facial proportions without requiring server-side processing. The models have been trained on
                  diverse datasets to ensure accuracy across different ethnicities, ages, and genders.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Can I use the app if I already wear glasses?</AccordionTrigger>
                <AccordionContent>
                  For the most accurate results, we recommend taking a photo without glasses. Glasses can obscure your
                  natural face shape and affect the analysis. If you must wear glasses during the analysis (for example,
                  if you have very poor vision), try to choose frames that are thin and don't cast shadows on your face.
                  Alternatively, you can upload a photo of yourself without glasses from your photo library.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>How do I know which eyeglass style is best for me?</AccordionTrigger>
                <AccordionContent>
                  While our recommendations are based on what generally works best for your face shape, personal style
                  and preference are equally important. We suggest trying on several different styles, either virtually
                  through our AR feature or in person. Consider factors like your personal style, color preferences, and
                  the occasions where you'll wear the glasses. Remember that confidence in your choice is just as
                  important as following design principles.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Does the app work on all devices?</AccordionTrigger>
                <AccordionContent>
                  Our app works on most modern devices with a camera and an up-to-date web browser. For the best
                  experience, we recommend using the latest version of Chrome, Safari, Firefox, or Edge. The AR try-on
                  feature works best on devices with front-facing cameras. If you're having trouble, try updating your
                  browser or switching to a different device. Some older devices may experience slower performance due
                  to the computational requirements of facial recognition.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>What if I'm between two face shapes?</AccordionTrigger>
                <AccordionContent>
                  Many people have features of multiple face shapes, which is completely normal. Our analyzer will
                  determine your primary face shape, but you may want to look at recommendations for both face shapes if
                  you feel you're between two types. The most important thing is finding eyeglasses that you feel
                  comfortable and confident wearing, regardless of strict categorization.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>Can I save my analysis results?</AccordionTrigger>
                <AccordionContent>
                  Currently, you can take screenshots of your results or download images from the AR try-on feature. We
                  plan to add user accounts in the future, which will allow you to save your face shape analysis and
                  favorite frame styles. Stay tuned for updates on this feature!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Us Section */}
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions or feedback? Our team is here to help.
              </p>
              <Link href="mailto:support@wearables.ai" className="text-primary hover:underline">
                support@wearables.ai
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-4">Speak directly with our customer support team.</p>
              <p className="font-medium">+1 (555) 123-4567</p>
              <p className="text-xs text-muted-foreground mt-1">Mon-Fri: 9am-5pm EST</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Visit Us</h3>
              <p className="text-sm text-muted-foreground mb-4">Come see us at our headquarters.</p>
              <address className="not-italic text-sm">
                123 Vision Street
                <br />
                Suite 456
                <br />
                San Francisco, CA 94103
              </address>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" placeholder="What's this about?" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea id="message" placeholder="Your message" rows={5} />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <Footer />
      </div>
    </main>
  )
}
