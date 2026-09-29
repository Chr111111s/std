import { HeroSection } from '@/components/HeroSection'
import { ParentsGodparentsSection } from '@/components/ParentsGodparentsSection'
import { PhotoStorySection } from '@/components/PhotoStorySection'
import { EventDetailsSection } from '@/components/EventDetailsSection'
import { TimelineSection } from '@/components/TimelineSection'
import { DressCodeSection } from '@/components/DressCodeSection'
import { GiftRegistrySection } from '@/components/GiftRegistrySection'
import { RsvpSection } from '@/components/RsvpSection'
import { FooterSection } from '@/components/FooterSection'
import { AudioPlayer } from '@/components/AudioPlayer'
import { Icon } from '@/components/ui/Icon'
import { NotFoundPage } from '@/components/NotFoundPage'
import { useInvitation } from '@/hooks/useInvitation'

export default function App() {
  const invitation = useInvitation()
  if (!invitation) return <NotFoundPage />

  return (
    <>
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <header className="site-header page-width">
        <a
          href="#inicio"
          className="brand"
          aria-label="Valeria y Eduardo, inicio"
        >
          V<span>&</span>E
        </a>
        <nav aria-label="Navegación principal">
          <a className="nav-detail" href="#celebracion">
            La celebración
          </a>
          <a className="nav-detail" href="#itinerario">
            El gran día
          </a>
          <a className="nav-detail" href="#regalos">
            Regalos
          </a>
          <a className="nav-rsvp" href="#confirmar">
            Confirmar asistencia <Icon name="arrow" width="14" height="14" />
          </a>
        </nav>
      </header>
      <main id="contenido">
        <HeroSection />
        <ParentsGodparentsSection />
        <PhotoStorySection />
        <EventDetailsSection />
        <TimelineSection />
        <DressCodeSection />
        <GiftRegistrySection />
        <RsvpSection invitation={invitation} />
      </main>
      <FooterSection />
      <AudioPlayer />
    </>
  )
}
