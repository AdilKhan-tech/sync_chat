import { useEffect } from "react";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import MyStatus from "../components/Status/MyStatus";
import StatusBar from "../components/Status/StatusBar";
import StatusViewer from "../components/Status/StatusViewer";

import { useStatusStore } from "../store/useStatusStore";

const StatusPage = () => {
  const navigate = useNavigate();

  const { loading, statuses, getStatusFeed, getMyStatus, initStatusSocket } =
    useStatusStore();

  useEffect(() => {
    getStatusFeed();
    getMyStatus();
    initStatusSocket();
  }, [getStatusFeed, getMyStatus, initStatusSocket]);

  return (
    <div className="min-h-screen w-full bg-base-100 flex flex-col">
      {/* HEADER */}
      <header
        className="
        sticky
        top-0
        z-20
        bg-base-100/90
        backdrop-blur-md
        border-b
        border-base-300
        "
      >
        <div
          className="
          flex
          items-center
          justify-between
          px-8
          py-6
          "
        >
          <div
            className="
            flex
            items-center
            gap-5
            "
          >
            <button
              onClick={() => navigate(-1)}
              className="
              btn
              btn-circle
              btn-ghost
              "
            >
              <ArrowLeft size={25} />
            </button>

            <div>
              <h1
                className="
                text-3xl
                font-bold
                "
              >
                Status
              </h1>

              <p
                className="
                text-base
                opacity-60
                "
              >
                Updates from your contacts
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/status")}
            className="
            btn
            btn-circle
            btn-success
            text-white
            "
          >
            <Plus size={25} />
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main
        className="
        flex-1
        overflow-y-auto
        w-full
        "
      >
        {/* SEARCH */}
        <div
          className="
          px-8
          py-6
          max-w-4xl
          mx-auto
          "
        >
          <div
            className="
            flex
            items-center
            gap-4
            bg-base-200
            rounded-2xl
            px-6
            py-4
            "
          >
            <Search size={22} className="opacity-50" />

            <input
              placeholder="Search status"
              className="
              bg-transparent
              outline-none
              w-full
              text-base
              "
            />
          </div>
        </div>

        {/* MY STATUS */}
        <section
          className="
          px-8
          max-w-4xl
          mx-auto
          "
        >
          <div
            className="
            rounded-3xl
            overflow-hidden
            border
            border-base-300
            "
          >
            <MyStatus />
          </div>
        </section>

        {/* TITLE */}
        <div
          className="
          px-8
          pt-8
          pb-4
          max-w-4xl
          mx-auto
          "
        >
          <h2
            className="
            font-semibold
            text-base
            opacity-70
            "
          >
            Recent Updates
          </h2>
        </div>

        {/* LOADING */}
        {loading && (
          <div
            className="
            flex
            justify-center
            py-20
            "
          >
            <span
              className="
              loading
              loading-spinner
              loading-lg
              "
            />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && statuses.length === 0 && (
          <div
            className="
            flex
            flex-col
            items-center
            justify-center
            py-32
            "
          >
            <div
              className="
              w-32
              h-32
              rounded-full
              bg-base-200
              flex
              items-center
              justify-center
              text-6xl
              "
            >
              📷
            </div>

            <h3
              className="
              mt-6
              text-xl
              font-bold
              "
            >
              No Status Yet
            </h3>

            <p
              className="
              text-base
              opacity-60
              "
            >
              Share your first update
            </p>
          </div>
        )}

        {/* STATUS LIST */}
        {!loading && statuses.length > 0 && (
          <div
            className="
            px-8
            pb-12
            space-y-4
            max-w-4xl
            mx-auto
            "
          >
            {statuses.map((status) => (
              <div
                key={status.id}
                className="
                rounded-3xl
                overflow-hidden
                border
                border-base-300
                hover:bg-base-200
                transition
                "
              >
                <StatusBar status={status} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* VIEWER */}
      <StatusViewer />
    </div>
  );
};

export default StatusPage;
