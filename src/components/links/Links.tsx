import { useState } from "react";

export default function Links() {
  const [link, setLink] = useState("");
  const [links, setLinks] = useState<string[]>(() => {
    const saved = localStorage.getItem("links");
    return saved ? JSON.parse(saved) : [];
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLinks(prev => {
      const updated = [...prev, link];
      localStorage.setItem("links", JSON.stringify(updated));
      return updated;
    });

    setLink("");
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="link-inputs">
          <input
            className="video-links"
            name="link"
            value={link}
            onChange={e => setLink(e.target.value)}
          />
          <button type="submit" className="submit-video-link">
            Pin Link
          </button>
        </div>
      </form>
      <ul>
        {links.map((item, index) => (
          <iframe width="300" height="120" src={item} key={index}></iframe>
        ))}
      </ul>
    </>
  );
}

//TODO: Each link needs to be /embedded, make a function to properly format the link

