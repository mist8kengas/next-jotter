// import Head from 'next/head';
import Link from 'next/link';

import defaultStyles from '../styles/default.module.css';
import styles from '../styles/Main.module.css';

import Head from '../page_components/Head.js';
import { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import jwt from 'jsonwebtoken';

import { Buffer } from 'buffer';
import crypto from 'crypto';

// jwt private key
import { PrivateKey } from './.well-known/private.js';
const privateKey = Buffer.from(PrivateKey.base64, 'base64');

const Main = () => {
    const [jotContent, setJotContent] = useState('');
    const [readyToUpload, setReadyToUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadJotUrl, setUploadJotUrl] = useState('');

    const jotArea = useRef({});
    jotArea.current.oninput = (ev) => {
        const { value } = ev.target;

        if (value.length >= 3) setReadyToUpload(true);
        else setReadyToUpload(false);
        setJotContent(value);
    };
    jotArea.current.onkeydown = (ev) => {
        if (ev.keyCode == 9) {
            ev.preventDefault();

            const { selectionStart, selectionEnd, value } = ev.target;
            let newContent = jotContent + ' '.repeat(3);
            if (selectionStart + selectionEnd != value.length * 2)
                newContent = jotContent
                    .split('')
                    .map((character, index) => {
                        if (index >= selectionStart && index <= selectionStart)
                            return ' '.repeat(3);
                        else return character;
                    })
                    .join('');

            setJotContent(newContent);
        }
    };

    // update jot area on update
    useEffect(() => (jotArea.current.value = jotContent), [jotContent]);

    const uploadJot = async () => {
        setUploading(true);
        setUploadJotUrl('');

        // sign token
        const jotHash = crypto
            .createHash('sha256')
            .update(jotContent)
            .digest('hex');
        const payload = { hash: jotHash, session: Date.now() };
        const token = jwt.sign(payload, privateKey, { algorithm: 'RS512' });

        const api = await axios
            .post('/api/jot/upload', {
                jot: Buffer.from(jotContent, 'utf-8').toString('base64'),
                token: token,
            })
            .catch(() => false);

        if (api) {
            console.log('[upload]', api.data);
            setTimeout(() => {
                setUploading(false);
                setUploadJotUrl(api.data.jot.url);
            }, 1e3);
        } else {
            console.error('[upload]', api);
            setUploading(true);
        }
    };

    const uploadButtonTitle = readyToUpload
        ? uploading
            ? 'Uploading'
            : 'Click to upload'
        : 'Jot must be 3 characters or longer to upload';
    return (
        <div className={defaultStyles.mainContainer}>
            <Head></Head>

            <main className={defaultStyles.main}>
                <div className={defaultStyles.jotDescription}>
                    <h1 className={defaultStyles.title}>Start Jotting</h1>
                </div>

                <div className={defaultStyles.jotArea}>
                    <textarea
                        ref={jotArea}
                        onInput={jotArea.current.oninput}
                        placeholder={'Jot down something here.'}
                        autoFocus={true}
                    ></textarea>
                </div>

                <div className={styles.uploadContainer}>
                    <div className={styles.uploadedJotUrlContainer}>
                        {uploadJotUrl ? (
                            <Link href={uploadJotUrl} prefetch={true}>
                                <button title={'View Jot'} disabled={false}>
                                    View Jot
                                </button>
                            </Link>
                        ) : (
                            <Link href={''} onClick={(e) => e.preventDefault()}>
                                <button disabled={true}>View Jot</button>
                            </Link>
                        )}
                    </div>
                    <div className={styles.uploadButtonContainer}>
                        <button
                            onClick={uploadJot}
                            title={uploadButtonTitle}
                            disabled={!readyToUpload || uploading}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Main;
