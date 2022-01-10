// import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import defaultStyles from '../../styles/default.module.css';
import styles from '../../styles/Jot.module.css';

import Head from '../../page_components/Head.js';
import { useEffect, useRef, useState } from 'react';

import axios from 'axios';

const Main = () => {
    const { jotId } = useRouter().query;
    const [jotData, setJotData] = useState('');
    const [jotIdLoaded, setJotIdLoaded] = useState(true);
    const [jotRenderTimes, setJotRenderTimes] = useState(0);
    const [jotInformation, setJotInformation] = useState('');

    const jotContent = useRef({});

    const loadData = async (jotId) => {
        const api = await axios.get(`/api/jot/${jotId}`).catch(() => false);
        if (api) {
            setJotData(api.data);
            setJotRenderTimes(1);
        } else {
            setJotData('0');
        }
    };

    // get jot data from api
    useEffect(() => {
        if (jotId) {
            setJotIdLoaded(true);
            loadData(jotId);
        }
    }, [jotId, jotIdLoaded]);

    // set jot data to text box
    useEffect(() => {
        if (jotRenderTimes == 1) {
            const jotDate = new Date(jotData.jot.date_created);
            setJotInformation({
                id: Math.round(Math.random() * 10),
                date: jotDate.toLocaleString(),
            });
            jotContent.current.value = jotData.jot.content;
        }
    }, [jotData, jotRenderTimes]);

    if (jotData && jotData != '0')
        return (
            <div className={defaultStyles.mainContainer}>
                <Head></Head>

                <main className={defaultStyles.main}>
                    <div className={defaultStyles.description}>
                        <h1 className={defaultStyles.title}>A Jot</h1>
                        <span>
                            Created on{' '}
                            <time>{jotInformation.date} (local timezone)</time>
                        </span>
                    </div>

                    <div className={defaultStyles.jotArea}>
                        <textarea ref={jotContent} readOnly={true}></textarea>
                    </div>

                    <div className={styles.buttonContainer}>
                        <div className={styles.navButton}>
                            <Link href={'/'} prefetch={true}>
                                <button
                                    disabled={false}
                                    title={'Jot something'}
                                >
                                    Jot something
                                </button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    else if (jotData == '0')
        return (
            <div className={defaultStyles.mainContainer}>
                <Head></Head>

                <main className={defaultStyles.main}>
                    <div className={defaultStyles.description}>
                        <h3 className={defaultStyles.title}>Jot not found</h3>
                    </div>

                    <div className={styles.buttonContainerCentered}>
                        <div className={styles.navButton}>
                            <Link href={'/'} prefetch={true}>
                                <button
                                    disabled={false}
                                    title={'Jot something'}
                                >
                                    Jot something
                                </button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    else
        return (
            <div className={defaultStyles.mainContainer}>
                <Head></Head>

                <main className={defaultStyles.main}>
                    <div className={defaultStyles.description}>
                        <h3 className={defaultStyles.title}>Loading Jot</h3>
                        <div className={defaultStyles.loadingAnimation}>
                            <div className={defaultStyles.loadAnimBar}></div>
                        </div>
                    </div>
                </main>
            </div>
        );
};

export default Main;
