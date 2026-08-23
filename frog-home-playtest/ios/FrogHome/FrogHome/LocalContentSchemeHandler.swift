import Foundation
import WebKit

final class LocalContentSchemeHandler: NSObject, WKURLSchemeHandler {
    static let scheme = "frog-home"

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard
            let requestURL = urlSchemeTask.request.url,
            let resourceRoot = Bundle.main.resourceURL?.appendingPathComponent("Web", isDirectory: true)
        else {
            urlSchemeTask.didFailWithError(URLError(.fileDoesNotExist))
            return
        }

        let decodedPath = requestURL.path.removingPercentEncoding ?? requestURL.path
        let pathComponents = decodedPath.split(separator: "/").map(String.init)
        guard !pathComponents.contains("..") else {
            urlSchemeTask.didFailWithError(URLError(.noPermissionsToReadFile))
            return
        }

        let relativePath = pathComponents.isEmpty ? "index.html" : pathComponents.joined(separator: "/")
        let resourceURL = resourceRoot.appendingPathComponent(relativePath).standardizedFileURL
        let safeRootPath = resourceRoot.standardizedFileURL.path + "/"
        guard resourceURL.path.hasPrefix(safeRootPath) else {
            urlSchemeTask.didFailWithError(URLError(.noPermissionsToReadFile))
            return
        }

        do {
            let data = try Data(contentsOf: resourceURL, options: .mappedIfSafe)
            let response = URLResponse(
                url: requestURL,
                mimeType: mimeType(for: resourceURL.pathExtension),
                expectedContentLength: data.count,
                textEncodingName: textEncoding(for: resourceURL.pathExtension)
            )
            urlSchemeTask.didReceive(response)
            urlSchemeTask.didReceive(data)
            urlSchemeTask.didFinish()
        } catch {
            urlSchemeTask.didFailWithError(error)
        }
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}

    private func mimeType(for pathExtension: String) -> String {
        switch pathExtension.lowercased() {
        case "html": "text/html"
        case "css": "text/css"
        case "js", "mjs": "text/javascript"
        case "json": "application/json"
        case "png": "image/png"
        case "jpg", "jpeg": "image/jpeg"
        case "svg": "image/svg+xml"
        case "woff": "font/woff"
        case "woff2": "font/woff2"
        default: "application/octet-stream"
        }
    }

    private func textEncoding(for pathExtension: String) -> String? {
        switch pathExtension.lowercased() {
        case "html", "css", "js", "mjs", "json", "svg": "utf-8"
        default: nil
        }
    }
}
