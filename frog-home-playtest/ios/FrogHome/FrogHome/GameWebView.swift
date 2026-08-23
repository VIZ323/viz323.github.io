import SwiftUI
import UIKit
import WebKit

struct GameWebView: UIViewRepresentable {
    final class Coordinator: NSObject, WKNavigationDelegate {
        let contentHandler = LocalContentSchemeHandler()
        let hapticHandler = HapticMessageHandler()

        func webView(
            _ webView: WKWebView,
            decidePolicyFor navigationAction: WKNavigationAction,
            decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
        ) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.cancel)
                return
            }

            if url.scheme == "frog-home" || url.scheme == "about" {
                decisionHandler(.allow)
                return
            }

            if ["https", "http"].contains(url.scheme?.lowercased() ?? "") {
                UIApplication.shared.open(url)
            }
            decisionHandler(.cancel)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.setURLSchemeHandler(
            context.coordinator.contentHandler,
            forURLScheme: LocalContentSchemeHandler.scheme
        )
        configuration.userContentController.add(
            context.coordinator.hapticHandler,
            name: HapticMessageHandler.messageName
        )

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0.73, green: 0.88, blue: 0.80, alpha: 1)
        webView.scrollView.backgroundColor = webView.backgroundColor
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.allowsBackForwardNavigationGestures = false

#if DEBUG
        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }
#endif

        guard let url = URL(string: "\(LocalContentSchemeHandler.scheme)://app/index.html") else {
            assertionFailure("无法生成本地游戏地址")
            return webView
        }
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    static func dismantleUIView(_ webView: WKWebView, coordinator: Coordinator) {
        webView.stopLoading()
        webView.navigationDelegate = nil
        webView.configuration.userContentController.removeScriptMessageHandler(
            forName: HapticMessageHandler.messageName
        )
    }
}

final class HapticMessageHandler: NSObject, WKScriptMessageHandler {
    static let messageName = "haptic"

    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard message.name == Self.messageName else { return }

        let values: [Double]
        if let value = message.body as? NSNumber {
            values = [value.doubleValue]
        } else if let pattern = message.body as? [NSNumber] {
            values = pattern.map(\.doubleValue)
        } else {
            values = []
        }

        let strongest = values.max() ?? 9
        let style: UIImpactFeedbackGenerator.FeedbackStyle = strongest >= 20 ? .medium : .light
        let intensity = min(1, max(0.35, strongest / 24))
        DispatchQueue.main.async {
            let generator = UIImpactFeedbackGenerator(style: style)
            generator.prepare()
            generator.impactOccurred(intensity: intensity)
        }
    }
}
