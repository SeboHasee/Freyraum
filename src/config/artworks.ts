export interface Artwork {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export const artworks: Artwork[] = [
  {
    title: 'Electric Storm',
    subtitle: 'Artwork 01',
    description:
      'Eine ruhige immersive digitale Kunstpräsentation mit realistischer Materialität und hochwertiger Lichtführung.',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=2400&auto=format&fit=crop',
  },
  {
    title: 'Quiet Coastline',
    subtitle: 'Artwork 02',
    description:
      'Minimalistische Küstenkomposition mit fein ausgearbeiteter Materialstruktur.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2400&auto=format&fit=crop',
  },
  {
    title: 'Tokyo Passage',
    subtitle: 'Artwork 03',
    description:
      'Cinematische urbane Perspektiven mit dramatischem Streiflicht.',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2400&auto=format&fit=crop',
  },
  {
    title: 'Golden Desert',
    subtitle: 'Artwork 04',
    description:
      'Atmosphärische Lichtstimmung kombiniert mit realistischer Leinwandstruktur.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop',
  },
];
