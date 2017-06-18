export declare class Doctor {
    constructor();
    chromedriverVersion(): string;
    /**
     * https://gist.github.com/tedmiston/5935757
     */
    testTcp(): Promise<boolean>;
}
export default Doctor;
