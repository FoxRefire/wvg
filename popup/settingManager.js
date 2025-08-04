class AsyncSyncStorage {
    static async setStorage(items) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set(items, () => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError));
                } else {
                    resolve();
                }
            });
        });
    }

    static async getStorage(keys) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(keys, (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError));
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async removeStorage(keys) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.remove(keys, (result) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError));
                } else {
                    resolve(result);
                }
            });
        });
    }
}

export class SettingsManager {
    static async saveUseShakaPackager(use_shaka) {
        await AsyncSyncStorage.setStorage({ use_shaka: use_shaka });
    }

    static async getUseShakaPackager() {
        const result = await AsyncSyncStorage.getStorage(["use_shaka"]);
        return result["use_shaka"] ?? true;
    }

    static async saveExecutableName(exe_name) {
        await AsyncSyncStorage.setStorage({ exe_name: exe_name });
    }

    static async getExecutableName() {
        const result = await AsyncSyncStorage.getStorage(["exe_name"]);
        return result["exe_name"] ?? "N_m3u8DL-RE";
    }

    static async getSetFilenameFromTitle() {
        const result = await AsyncSyncStorage.getStorage(["set_filename_from_title"]);
        return result["set_filename_from_title"] ?? false;
    }

    static async saveSetFilenameFromTitle(set_filename_from_title) {
        await AsyncSyncStorage.setStorage({ set_filename_from_title: set_filename_from_title });
    }

    static async getUseSelectVideo() {
        const result = await AsyncSyncStorage.getStorage(["use_select_video"]);
        return result["use_select_video"] ?? false;
    }

    static async saveUseSelectVideo(use_select_video) {
        await AsyncSyncStorage.setStorage({ use_select_video: use_select_video });
    }

    static async getSelectVideoParam() {
        const result = await AsyncSyncStorage.getStorage(["select_video_param"]);
        return result["select_video_param"] ?? "best";
    }

    static async saveSelectVideoParam(select_video_param) {
        await AsyncSyncStorage.setStorage({ select_video_param: select_video_param });
    }

    static async getUseSelectAudio() {
        const result = await AsyncSyncStorage.getStorage(["use_select_audio"]);
        return result["use_select_audio"] ?? false;
    }

    static async saveUseSelectAudio(use_select_audio) {
        await AsyncSyncStorage.setStorage({ use_select_audio: use_select_audio });
    }

    static async getSelectAudioParam() {
        const result = await AsyncSyncStorage.getStorage(["select_audio_param"]);
        return result["select_audio_param"] ?? "best";
    }
    static async saveSelectAudioParam(select_audio_param) {
        await AsyncSyncStorage.setStorage({ select_audio_param: select_audio_param });
    }
}