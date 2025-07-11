import AdminDashboard from "../components/admin/AdminDashboard";
import AdsCarousel from "../components/carousels/AdsCarousel/AdsCarousel";
import HomeCarousel from "../components/carousels/Home/HomeCarousel";
import { useUserContext } from "../context/UserContext";

function Home() {
    const { user } = useUserContext();

    return (
        <>
            <AdsCarousel id={"1"} />
            <div className="d-flex flex-column content-wrapper gap-5">
                {
                    user && user.isAdmin ? (
                        <AdminDashboard />
                    ) : (
                        <>
                            <div data-cy="home-carousel">
                                <HomeCarousel id={"1"} />
                            </div>
                        </>
                    )
                }
            </div >
        </>
    );
}

export default Home;