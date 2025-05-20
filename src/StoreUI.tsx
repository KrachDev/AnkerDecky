import { Focusable, Navigation } from "@decky/ui";
import { GamepadButton } from "@decky/ui";
import { useRef, useEffect, useState } from "react";
import {Game, AnkerGamesService } from "./Resources/Logic/TesTlogic";

interface CarouselProps {
    games: Game[];
    onSelect: (game: Game) => void;
}

// Component for the game carousel
const GameCarousel = ({ games, onSelect }: CarouselProps) => {
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const [currentIndex] = useState<number>(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, games.length);
    }, [games]);



    useEffect(() => {
        if (itemRefs.current[currentIndex]) {
            itemRefs.current[currentIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [currentIndex]);

    return (
        <div
        style={{
            position: 'relative',
            marginBottom: '30px',
            width: '100%',
            height: '280px',
        }}
        >
        <h2 style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#fff"
        }}>
        Featured Games
        </h2>

        <div
        ref={carouselRef}
        style={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            width: '100%',
            height: '230px',
            padding: '5px 0',
            msOverflowStyle: 'none',  /* Hide scrollbar IE and Edge */
            scrollbarWidth: 'none',   /* Hide scrollbar Firefox */
        }}
        className="custom-scrollbar"
        >
        {games.map((game: Game, index: number) => (
            <Focusable
            key={index}
            ref={(el) => itemRefs.current[index] = el}
            onOKButton={() => onSelect(game)}

            focusWithinClassName="carousel-item-focused"
            >
            <div
            style={{
                minWidth: '360px',
                height: '230px',
                margin: '0 10px',
                scrollSnapAlign: 'center',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                                   transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            >
            <img
            src={game.image}
            alt={game.title}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            }}
            onError={(e) => {
                (e.target as HTMLImageElement).src = "https://store.cloudflare.steamstatic.com/public/images/v6/app_image_not_available.png";
            }}
            />
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '15px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                                   color: 'white'
            }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{game.title}</h3>
            {game.version && (
                <span style={{
                    display: 'inline-block',
                    marginTop: '5px',
                    background: 'rgba(0, 0, 0, 0.5)',
                              padding: '3px 8px',
                              borderRadius: '3px',
                              fontSize: '12px',
                }}>
                {game.version}
                </span>
            )}
            </div>
            </div>
            </Focusable>
        ))}
        </div>

        <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px'
        }}>
        {games.map((_: Game, idx: number) => (
            <span
            key={idx}
            style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: idx === currentIndex ? '#1a9fff' : 'rgba(255,255,255,0.3)',
                                              transition: 'background 0.3s'
            }}
            />
        ))}
        </div>
        </div>
    );
};

interface CategoryProps {
    title: string;
    games: Game[];
    onSelect: (game: Game) => void;
}

// Component for a game category section
const GameCategory = ({ title, games, onSelect }: CategoryProps) => {
    const columns = 5;
    const tileWidth = 240;
    const tileHeight = 135; // 16:9 aspect ratio
    const infoBoxHeight = 60;
    const totalTileHeight = tileHeight + infoBoxHeight;

    const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        tileRefs.current = tileRefs.current.slice(0, games.length);
    }, [games]);

    return (
        <div style={{ marginBottom: '40px' }}>
        <h2 style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#fff"
        }}>
        {title}
        </h2>

        <div
        style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, ${tileWidth}px)`,
            gap: "15px",
            overflowX: "auto",
            paddingBottom: "10px"
        }}
        className="custom-scrollbar"
        >
        {games.map((game: Game, index: number) => {
            // Calculate row and column for this item
            const col = index % columns;

            return (
                <Focusable
                key={index}
                ref={(el) => tileRefs.current[index] = el}
                onOKButton={() => onSelect(game)}
                focusWithinClassName="game-tile-focused"
                onButtonDown={(evt) => {
                    if (evt.detail.button === GamepadButton.DIR_LEFT && col > 0) {
                        const leftIndex = index - 1;
                        tileRefs.current[leftIndex]?.focus();
                        return true;
                    }

                    if (evt.detail.button === GamepadButton.DIR_RIGHT && col < columns - 1 && index < games.length - 1) {
                        const rightIndex = index + 1;
                        tileRefs.current[rightIndex]?.focus();
                        return true;
                    }
                    if (evt.detail.button === GamepadButton.DIR_DOWN && col < columns - 1 && index < games.length - 1) {
                        const rightIndex = index + columns - 1;
                        tileRefs.current[rightIndex]?.focus();
                        return true;
                    }
                    if (evt.detail.button === GamepadButton.DIR_UP && col < columns - 1 && index < games.length - 1) {
                        const rightIndex = index - columns + 1;
                        tileRefs.current[rightIndex]?.focus();
                        return true;
                    }
                    return false;
                }}
                >
                <div
                className="game-tile"
                style={{
                    width: `${tileWidth}px`,
                    height: `${totalTileHeight}px`,
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#2a475e",
                    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column"
                }}
                >
                {/* Image container */}
                <div style={{
                    position: "relative",
                    width: "100%",
                    height: `${tileHeight}px`,
                    overflow: "hidden"
                }}>
                <img
                src={game.image}
                alt={game.title}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center"
                }}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://store.cloudflare.steamstatic.com/public/images/v6/app_image_not_available.png";
                }}
                />
                {game.version && (
                    <div style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0, 0, 0, 0.7)",
                                  color: "white",
                                  padding: "2px 6px",
                                  borderRadius: "3px",
                                  fontSize: "11px",
                                  fontWeight: "bold"
                    }}>
                    {game.version}
                    </div>
                )}
                </div>

                {/* Game information */}
                <div style={{
                    padding: "10px",
                    height: `${infoBoxHeight - 20}px`,
                    overflow: "hidden"
                }}>
                <h3 style={{
                    margin: "0 0 3px 0",
                    fontSize: "14px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}>
                {game.title}
                </h3>
                {game.description && (
                    <p style={{
                        margin: "0",
                        fontSize: "12px",
                        color: "#acb2b8",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}>
                    {game.description}
                    </p>
                )}
                </div>
                </div>
                </Focusable>
            );
        })}
        </div>
        </div>
    );
};

interface TabItem {
    id: string;
    label: string;
}

// Main component
export const StoreUI = () => {
    const [categories, setCategories] = useState<{
        carousel: Game[];
        trending: Game[];
        upcoming: Game[];
        latest: Game[];
    }>({
        carousel: [],
        trending: [],
        upcoming: [],
        latest: []
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('all');

    // Tabs for navigation
    const tabs: TabItem[] = [
        { id: 'all', label: 'All Games' },
        { id: 'trending', label: 'Trending' },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'latest', label: 'Latest' }
    ];

    const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        tabRefs.current = tabRefs.current.slice(0, tabs.length);
    }, [tabs]);

    // Fetch games when the component mounts
    useEffect(() => {
        const loadGames = async (): Promise<void> => {
            try {
                setLoading(true);
                const gameService = new AnkerGamesService();

                // Fetch all categories in parallel
                const [carousel, trending, upcoming, latest] = await Promise.all([
                    gameService.fetchCarouselGames(),
                                                                                 gameService.fetchTrendingGames(),
                                                                                 gameService.fetchUpcomingGames(),
                                                                                 gameService.fetchLatestGames()
                ]);

                setCategories({
                    carousel,
                    trending,
                    upcoming,
                    latest
                });

                setLoading(false);
            } catch (err) {
                setError("Failed to load games. Please try again later.");
                setLoading(false);
                console.error("Error fetching games:", err);
            }
        };

        loadGames();
    }, []);

    // Handle game selection
    const handleGameSelect = (game: Game): void => {
        console.log(`Selected game: ${game.title}`);
        window.open(game.game_url, '_blank');
    };

    // Handle tab selection
    const handleTabSelect = (tabId: string): void => {
        setActiveTab(tabId);
    };

    // Render footer with gamepad button legends
    const renderFooterLegends = (): JSX.Element => {
        return (
            <div style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "10px",
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                justifyContent: "space-around",
                zIndex: 1000
            }}>
            <div>🎮 A: Select Game</div>
            <div>🎮 ⬅️➡️⬆️⬇️: Navigate</div>
            <div>🎮 LB/RB: Switch Tab</div>
            <div>🎮 B: Back to Menu</div>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontSize: "24px",
                background: "#1b2838"
            }}>
            <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "20px" }}>Loading Anker Games...</div>
            <div className="loading-spinner"></div>
            </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                padding: "20px",
                background: "#1b2838"
            }}>
            <div style={{ fontSize: "24px", marginBottom: "20px" }}>❌ {error}</div>
            <Focusable style={{ width: "200px" }} onOKButton={() => window.location.reload()}>
            <div style={{
                padding: "10px",
                textAlign: "center",
                background: "#3d4450",
                borderRadius: "5px"
            }}>
            Retry
            </div>
            </Focusable>
            </div>
        );
    }

    // Render content based on the active tab
    const renderContent = (): JSX.Element => {
        switch (activeTab) {
            case 'trending':
                return <GameCategory title="Trending Games" games={categories.trending} onSelect={handleGameSelect} />;
            case 'upcoming':
                return <GameCategory title="Upcoming Games" games={categories.upcoming} onSelect={handleGameSelect} />;
            case 'latest':
                return <GameCategory title="Latest Games" games={categories.latest} onSelect={handleGameSelect} />;
            case 'all':
            default:
                return (
                    <>
                    <GameCarousel games={categories.carousel} onSelect={handleGameSelect} />
                    <GameCategory title="Trending Games" games={categories.trending.slice(0, 8)} onSelect={handleGameSelect} />
                    <GameCategory title="Upcoming Games" games={categories.upcoming.slice(0, 8)} onSelect={handleGameSelect} />
                    <GameCategory title="Latest Games" games={categories.latest.slice(0, 8)} onSelect={handleGameSelect} />
                    </>
                );
        }
    };

    return (
        <div style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#1b2838",
            color: "white",
            overflowY: "auto",
            paddingBottom: "60px" // Space for footer
        }}>
        {/* Header */}
        <div style={{
            padding: "15px 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            backgroundColor: "#171d25",
            position: "sticky",
            top: 0,
            zIndex: 10
        }}>
        <h1 style={{
            margin: "0 0 15px 0",
            fontSize: "26px",
            fontWeight: "bold",
        }}>
        Anker Game Store
        </h1>

        {/* Tabs */}
        <div style={{
            display: "flex",
            gap: "10px",
        }}>
        {tabs.map((tab: TabItem, index: number) => (
            <Focusable
            key={tab.id}
            ref={(el) => tabRefs.current[index] = el}
            onOKButton={() => handleTabSelect(tab.id)}
            focusWithinClassName="tab-focused"
            onButtonDown={(evt) => {
                if (evt.detail.button === GamepadButton.BUMPER_LEFT) {
                    // Move to the previous tab
                    const prevIndex = (index - 1 + tabs.length) % tabs.length;
                    tabRefs.current[prevIndex]?.focus();
                    handleTabSelect(tabs[prevIndex].id);
                    return true;
                }
                if (evt.detail.button === GamepadButton.BUMPER_RIGHT) {
                    // Move to the next tab
                    const nextIndex = (index + 1) % tabs.length;
                    tabRefs.current[nextIndex]?.focus();
                    handleTabSelect(tabs[nextIndex].id);
                    return true;
                }
                if (evt.detail.button === GamepadButton.CANCEL) {
                    Navigation.NavigateBack();
                    return true;
                }
                return false;
            }}
            >
            <div
            className={`tab ${activeTab === tab.id ? 'active-tab' : ''}`}
            style={{
                padding: "8px 15px",
                borderRadius: "5px",
                background: activeTab === tab.id ? "#1a9fff" : "#2a475e",
                cursor: "pointer",
                transition: "background 0.2s",
                fontWeight: activeTab === tab.id ? "bold" : "normal",
            }}
            >
            {tab.label}
            </div>
            </Focusable>
        ))}
        </div>
        </div>

        {/* Main content */}
        <div style={{ padding: "20px" }}>
        {renderContent()}
        </div>

        {renderFooterLegends()}

        {/* CSS for focus states and animations */}
        <style>
        {`
            .game-tile-focused .game-tile {
                transform: scale(1.05);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5), 0 0 0 3px #1a9fff;
                background: #366584;
            }

            .carousel-item-focused > div {
                transform: scale(1.05);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5), 0 0 0 3px #1a9fff;
            }

            .tab-focused > div {
                box-shadow: 0 0 0 3px rgba(26, 159, 255, 0.7);
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                margin: 0 auto;
                border: 4px solid rgba(255, 255, 255, 0.2);
                border-top-color: #ffffff;
                border-radius: 50%;
                animation: spin 1s infinite linear;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .custom-scrollbar::-webkit-scrollbar {
                height: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }

            .active-tab {
                position: relative;
            }

            .active-tab:after {
                content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: #1a9fff;
    border-radius: 50%;
            }
            `}
            </style>
            </div>
    );
};
