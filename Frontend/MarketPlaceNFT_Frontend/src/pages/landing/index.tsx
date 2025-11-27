// src/pages/landing/index.tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/landing/style.css';

const LandingPage: React.FC = () => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const root = rootRef.current;
        if (!root) {
            console.error('Root ref is null - skipping animations'); // DEBUG: Log nếu ref null
            return;
        }

        const windowWidth = window.innerWidth;
        const wrapperWidth = 180;
        const finalPosition = windowWidth - wrapperWidth;
        const stepDistance = finalPosition / 6;
        const tl = gsap.timeline();

        tl.to(root.querySelectorAll('.count'), {
            x: -900,
            duration: 0.85,
            delay: 0.5,
            ease: 'power4.inOut',
        });

        // animate the 6 steps (keeps behaviour from original script)
        for (let i = 1; i <= 6; i++) {
            const xPosition = -900 + i * 180;
            tl.to(root.querySelectorAll('.count'), {
                x: xPosition,
                duration: 0.85,
                ease: 'power4.inOut',
                onStart: () => {
                    gsap.to(root.querySelectorAll('.count-wrapper'), {
                        x: stepDistance * i,
                        duration: 0.85,
                        ease: 'power4.inOut',
                    });
                },
            });
        }

        gsap.set(root.querySelectorAll('.revealer svg'), { scale: 0 });

        const delays: number[] = [6, 6.5, 7];
        const revealerSvgs = root.querySelectorAll('.revealer svg');
        if (revealerSvgs.length === 0) {
            console.warn('No revealer SVGs found - skipping'); // DEBUG: Nếu empty
            return;
        }
        revealerSvgs.forEach((el, i) => {
            gsap.to(el, {
                scale: 45,
                duration: 1.5,
                ease: 'power4.inOut',
                delay: delays[i],
                onComplete: () => {
                    if (i === delays.length - 1) {
                        const loader = root.querySelector('.loader');
                        if (loader) loader.remove();
                        navigate('/home');
                    }
                },
            });
        });

        gsap.to(root.querySelector('.header h1'), {
            onStart: () => {
                gsap.to(root.querySelector('.toggle-btn'), {
                    scale: 1,
                    duration: 1,
                    ease: 'power4.inOut',
                });

                gsap.to(root.querySelectorAll('.line p'), {
                    y: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power3.inOut',
                });

                // Thêm animation cho nút "Go to home" sau khi loader hoàn thành
                gsap.fromTo(
                    root.querySelector('.go-to-home'),
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1.5, ease: 'power3.inOut', delay: 0.5 }
                );
            },
            rotateY: 0,
            opacity: 1,
            duration: 2,
            ease: 'power3.inOut',
            delay: 8,
        });

        // cleanup function
        return () => {
            try {
                tl.kill();
                gsap.killTweensOf('*');
            } catch (e) {
                // ignore
            }
        };
    }, [navigate]);

    return (
        <div ref={rootRef}>
            <div className="loader">
                <div className="count-wrapper">
                    <div className="count">
                        <div className="digit">
                            <h1>9</h1>
                        </div>
                        <div className="digit">
                            <h1>8</h1>
                        </div>
                        <div className="digit">
                            <h1>7</h1>
                        </div>
                        <div className="digit">
                            <h1>4</h1>
                        </div>
                        <div className="digit">
                            <h1>2</h1>
                        </div>
                        <div className="digit">
                            <h1>0</h1>
                        </div>
                    </div>
                </div>

                <div className="count-wrapper">
                    <div className="count">
                        <div className="digit">
                            <h1>9</h1>
                        </div>
                        <div className="digit">
                            <h1>5</h1>
                        </div>
                        <div className="digit">
                            <h1>9</h1>
                        </div>
                        <div className="digit">
                            <h1>7</h1>
                        </div>
                        <div className="digit">
                            <h1>4</h1>
                        </div>
                        <div className="digit">
                            <h1>8</h1>
                        </div>
                    </div>
                </div>

                <div className="revealer revealer-1">
                    <svg width="151" height="148" viewBox="0 0 151 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M75.9817 0L77.25 34.2209C78.0259 55.1571 94.8249 71.9475 115.762 72.7127L150.982 74L115.762 75.2873C94.8249 76.0525 78.0259 92.8429 77.25 113.779L75.9817 148L74.7134 113.779C73.9375 92.8429 57.1385 76.0525 36.2019 75.2873L0.981689 74L36.2018 72.7127C57.1384 71.9475 73.9375 55.1571 74.7134 34.2209L75.9817 0Z" fill="white" />
                    </svg>
                </div>

                <div className="revealer revealer-2">
                    <svg width="151" height="148" viewBox="0 0 151 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M75.9817 0L77.25 34.2209C78.0259 55.1571 94.8249 71.9475 115.762 72.7127L150.982 74L115.762 75.2873C94.8249 76.0525 78.0259 92.8429 77.25 113.779L75.9817 148L74.7134 113.779C73.9375 92.8429 57.1385 76.0525 36.2019 75.2873L0.981689 74L36.2018 72.7127C57.1384 71.9475 73.9375 55.1571 74.7134 34.2209L75.9817 0Z" fill="#cdfd50" />
                    </svg>
                </div>

                <div className="revealer revealer-3">
                    <svg width="151" height="148" viewBox="0 0 151 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M75.9817 0L77.25 34.2209C78.0259 55.1571 94.8249 71.9475 115.762 72.7127L150.982 74L115.762 75.2873C94.8249 76.0525 78.0259 92.8429 77.25 113.779L75.9817 148L74.7134 113.779C73.9375 92.8429 57.1385 76.0525 36.2019 75.2873L0.981689 74L36.2018 72.7127C57.1384 71.9475 73.9375 55.1571 74.7134 34.2209L75.9817 0Z" fill="black" />
                    </svg>
                </div>
            </div>

            {/* <div className="container">
                <div className="site-info">
                    <div className="line">
                        <p>Digital &amp; Brand Design</p>
                    </div>
                    <div className="line">
                        <p>Photography &amp; Film Production</p>
                    </div>
                </div>

                <div className="toggle-btn">
                    <img src="/vite.svg" alt="" />
                </div>

                <div className="header">
                    <h1>Solana</h1>
                </div>
            </div> */}
        </div>
    );
};

export default LandingPage;