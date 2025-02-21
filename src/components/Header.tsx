import { createClient } from "@/prismicio";
import { PrismicNextLink } from "@prismicio/next";

export default async function Header() {
  const client = createClient();

  const settings = await client.getSingle("settings")

return (
  <header>
    <nav>
      <ul>
        {settings.data.navigation.map((item)=>(
          <li>
            <PrismicNextLink field={item.link} />
          </li>
        ))}
      </ul>
    </nav>
  </header>
)

}