import Column from "./Column";

export default function Board() {

  let columns = 7;
  
  return (
    <section className="flex items-center justify-center dark:bg-gray-900">
      <div className="flex my-14 rounded-lg dark:bg-gray-600">
        {
          Array(columns).fill().map((_, i) => (
            <Column key={i} id={i}></Column>
          ))
        }
      </div>
    </section>
  );
}
