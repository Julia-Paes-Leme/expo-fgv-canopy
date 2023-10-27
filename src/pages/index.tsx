import { CanopyEnvironment } from "@customTypes/canopy";
import Container from "@components/Shared/Container";
import FACETS from "@.canopy/facets.json";
import Heading from "../components/Shared/Heading/Heading";
import Hero from "@components/Hero/Hero";
import { HeroWrapper } from "../components/Hero/Hero.styled";
import Layout from "@components/layout";
import { LocaleString } from "@hooks/useLocale";
import React from "react";
import Related from "../components/Related/Related";
import { canopyManifests } from "@lib/constants/canopy";
import { createCollection } from "../lib/iiif/constructors/collection";
import { getRelatedFacetValue } from "../lib/iiif/constructors/related";
import { useCanopyState } from "@context/canopy";

interface IndexProps {
  featuredItem: any;
  collections: string[];
}

const Index: React.FC<IndexProps> = ({ featuredItem, collections }) => {
  const { canopyState } = useCanopyState();
  const {
    config: { baseUrl },
  } = canopyState;

  const hero = {
    ...featuredItem,
    items: featuredItem.items.map((item: any) => {
      return {
        ...item,
        homepage: [
          {
            id: `${baseUrl}/works/`,
            type: "Text",
            label: item.label,
          },
        ],
      };
    }),
  };

  return (
    <Layout>
      <HeroWrapper>
        <Hero collection={hero} />
      </HeroWrapper>
      <Container>
        <Heading as="h2">Ensaio sobre uma duna</Heading>
        <div>
          <p>
            Em <i>Ensaio sobre uma duna</i>, instalação inédita que ocupa o centro da Sala Casa
            e que dá nome à <a href="https://galeriaathena.com/exhibitions/50-jonas-arrabal-ensaio-sobre-uma-duna/">
              primeira exposição individual</a> de Jonas Arrabal na Athena,
            vemos quase que um panorâma da produção do artista, reunindo materiais aparentemente muito diversos,
            que o interessam desde 2011.
            É como um curioso diálogo com as caixas-valises de Marcel Duchamp 
            ou com a ideia de museu imaginário de André Malraux.
          </p>
        </div>
        <Related
          collections={collections}
          title={LocaleString("homepageHighlightedWorks")}
        />
      </Container>
    </Layout>
  );
};

export async function getStaticProps() {
  const manifests = canopyManifests();

  // @ts-ignore
  const { featured, metadata, baseUrl } = process.env
    ?.CANOPY_CONFIG as unknown as CanopyEnvironment;

  const randomFeaturedItem =
    manifests[Math.floor(Math.random() * manifests.length)];
  const featuredItem = await createCollection(
    featured ? featured : [randomFeaturedItem.id]
  );

  const collections = FACETS.map((facet) => {
    const value = getRelatedFacetValue(facet.label);
    return `${baseUrl}/api/facet/${facet.slug}/${value.slug}.json?sort=random`;
  });

  return {
    props: { metadata, featuredItem, collections },
    revalidate: 3600,
  };
}

export default Index;
