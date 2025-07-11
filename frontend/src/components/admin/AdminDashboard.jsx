import TopBuyers from "./top/TopBuyers";
import TopPurchased from "./top/TopPurchased";
import TopFavorites from "./top/TopFavorites";
import AdminUsersSearch from "./users/AdminUsersSearch";

export default function AdminDashboard() {
    return (
        <div className="my-4">
            <h1>Bienvenido, Admin!</h1>
            <p className="text-secondary">Desde acá podes administrar el sitio</p>
            <div>
                <AdminUsersSearch />
            </div>
            <div className="d-flex flex-column flex-md-row gap-4 justify-content-center">
            <TopPurchased />
            <TopFavorites />
            </div>
            <div>
                <TopBuyers />
            </div>
        </div>
    );
}