export default function Column(id) {
    console.log(id)
  let circles = 6;

  return (
    <ul id={`row-${id.id}`} className="">
      {Array(circles)
        .fill()
        .map((_, i) => (
          <li key={i} id={`${id.id}-${circles - 1 - i}`} className="rounded-full m-2 h-14 w-14 dark:bg-gray-900"></li>
        ))}
    </ul>
  );
}

