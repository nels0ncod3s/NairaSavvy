import DataLoading from "@/components/DataLoading";
export default function Loading() {
  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        className="route-loading container-content"
      >
        <DataLoading />
      </main>
    </>
  );
}
